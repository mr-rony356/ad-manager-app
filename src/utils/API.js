import Cookies from "js-cookie";

/**
 * The address of the api
 */
export const API_ADDRESS =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "production"
    ? "https://api.onlyfriend.ch/"
    : "http://localhost:3000/";

/**
 * FETCH REQUESTS CONTROLLER
 */
export default class ApiController {
  // HELPERS

  /* eslint-disable no-console */

  /**
   * Builds a request to the API
   * @param {*} path Path to the API
   * @param {*} method HTTP request [GET, POST, PUT, DELETE]
   * @param {*} body JSON object with the data to be transmitted
   * @param {*} token JWT access token
   * @return The request
   */
  buildRequest(path, method, body, token) {
    const options = {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "x-access-token": "Bearer " + token } : false),
      },
      method,
      ...(body ? { body: JSON.stringify(body) } : false),
    };
    return new Request(API_ADDRESS + path, options);
  }

  /**
   * Same as method above but for submitting form data instead
   */
  buildFormDataRequest(path, method, body, token) {
    const options = {
      headers: {
        ...(token ? { "x-access-token": "Bearer " + token } : false),
      },
      method,
      ...(body ? { body } : false),
    };
    return new Request(API_ADDRESS + path, options);
  }

  /**
   * Fetches the current stored JWT access token
   * @returns The JWT access token
   */
  fetchToken = () =>
    Cookies.get("Auth") ? JSON.parse(Cookies.get("Auth")).token : "";

  // GET REQUESTS

  /**
   * Fetches all the ads from the database
   * @param {*} type The type of ads to be fetched
   * @returns All the ads
   */
  async fetchAds(type) {
    try {
      const promise = await fetch(
        this.buildRequest("api/ads?type=" + type, "GET"),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch ads", err);
    }
  }

  /**
   * Fetches all the ads created by me from the database
   * @param {*} token The JWT token of the user
   * @param {*} limit The limit of ads to be fetched
   * @returns All the ads created by me
   */
  async fetchAdsByMe(token, limit) {
    try {
      const promise = await fetch(
        this.buildRequest(
          limit ? "api/ads/me?limit=" + limit : "api/ads/me",
          "GET",
          null,
          token ?? this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch ads by me", err);
      return [];
    }
  }

  /**
   * Fetches one specific ad from the database by its id
   * @param {*} id The id of the ad to be fetched
   * @returns The ad
   */
  async fetchAd(id) {
    try {
      const promise = await fetch(
        this.buildRequest("api/ad/" + id, "GET"),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch ad", err);
    }
  }

  /**
   * Fetches all the ads to verify from the database
   * @param {*} token The JWT token of the user
   * @returns All the ads to be verified
   */
  async fetchPendingAds(token) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "api/ads/pending",
          "GET",
          null,
          token ?? this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch ads to be verified", err);
      return [];
    }
  }

  /**
   * Fetches all the premium ads from the database
   * @param {*} type The type of ads to be fetched
   * @returns All the premium ads
   */
  async fetchPremiumAds(type) {
    try {
      const promise = await fetch(
        this.buildRequest("api/ads/premium?type=" + type, "GET"),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch premium ads", err);
    }
  }

  /**
   * Fetches all the favorite ads of the user from the database
   * @param {*} token The JWT token of the user
   * @returns All the favorite ads
   */
  async fetchFavorites(token) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "api/favorites",
          "GET",
          null,
          token ?? this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch favorites", err);
    }
  }

  /**
   * Fetches all the subscribed ads of the user from the database
   * @param {*} token The JWT token of the user
   * @returns All the subscribed ads
   */
  async fetchSubs(token) {
    try {
      const promise = await fetch(
        this.buildRequest("api/subs", "GET", null, token ?? this.fetchToken()),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch subscriptions", err);
    }
  }

  /**
   * Fetches all the translated attributes from the database
   * @param {*} language The preferred language
   * @returns All the attributes
   */
  async fetchAttributes(language) {
    try {
      const promise = await fetch(
        this.buildRequest("api/attributes?lang=" + language, "GET"),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch attributes", err);
    }
  }

  /**
   * Fetches all the available prices from stripe
   * @param {*} token The JWT token of the user
   * @param {*} currency The selected currency
   * @returns All the prices
   */
  async fetchPrices(token, currency) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "pay/prices?currency=" + currency,
          "GET",
          null,
          token ?? this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch prices", err);
    }
  }

  /**
   * Fetches the payment session from stripe
   * @param {*} token The JWT token of the user
   * @param {*} id The session id
   * @returns The payment session
   */
  async fetchPayment(token, id) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "pay?id=" + id,
          "GET",
          null,
          token ?? this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch the stripe payment", err);
    }
  }

  /**
   * Fetch the payment session from payrexx
   * @param {*} token The JWT token of the user
   * @param {*} id The session id
   * @returns The payment session
   */
  async fetchPaymentViaTwint(token, id) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "pay/twint?id=" + id,
          "GET",
          null,
          token ?? this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch the twint payment", err);
    }
  }

  /**
   * Fetches all the messages addressed to me
   * @param {*} token The JWT token of the user
   * @param {*} limit The limit of messages to be fetched
   * @returns All the messages
   */
  async fetchMessages(token, limit) {
    try {
      const promise = await fetch(
        this.buildRequest(
          limit ? "api/messages?limit=" + limit : "api/messages",
          "GET",
          null,
          token ?? this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch messages", err);
    }
  }

  /**
   * Fetch all the messages from a conversation with a user
   * @param {*} token The JWT token of the user
   * @param {*} id The id of the user
   * @param {*} limit The limit of messages to be fetched
   * @returns All the messages
   */
  async fetchMessagesWithUser(token, id, limit) {
    try {
      const promise = await fetch(
        this.buildRequest(
          limit
            ? "api/messages/" + id + "?limit=" + limit
            : "api/messages/" + id,
          "GET",
          null,
          token ?? this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch messages", err);
    }
  }

  /**
   * Fetches all the blog posts from the database
   * @returns All the blog posts
   */
  async fetchBlogs() {
    try {
      const promise = await fetch(
        this.buildRequest("api/blogs", "GET", null),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch blog posts", err);
    }
  }

  /**
   * Fetches all the blog posts created by me from the database
   * @param {*} token The JWT token of the user
   * @returns All the blog posts created by me
   */
  async fetchBlogsByMe(token) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "api/blogs/me",
          "GET",
          null,
          token ?? this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch blog posts by me", err);
    }
  }

  /**
   * Fetches one specific blog post from the database by its id
   * @param {*} id The id of the blog post to be fetched
   * @returns The blog post
   */
  async fetchBlog(id) {
    try {
      const promise = await fetch(
        this.buildRequest("api/blog/" + id, "GET", null),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not fetch blog post", err);
    }
  }

  // POST REQUESTS

  /**
   * Authenticates the user
   * @param {string} name Name of the user
   * @param {string} password Password of the user
   * @returns The authentication token
   */
  async doLogin(name, password) {
    try {
      const promise = await fetch(
        this.buildRequest("auth/login", "POST", {
          name,
          password,
        }),
      ).then((res) => res.json());
      if (promise.token) {
        Cookies.set("Auth", JSON.stringify(promise));
      }
      return promise;
    } catch (err) {
      console.error("API: Could not log in", err);
    }
  }

  /**
   * Deauthenticate the user
   */
  async doLogout() {
    Cookies.remove("Auth");
  }

  /**
   * Sign up a new user
   * @param {*} name Name of the user
   * @param {*} email Email address of the user
   * @param {*} password Password of the user
   * @param {*} password2 2nd password of the user
   * @returns The authentication tokem
   */
  async doSignup(name, email, password, password2) {
    try {
      const promise = await fetch(
        this.buildRequest("auth/signup", "POST", {
          name,
          email,
          password,
          password2,
        }),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not sign up", err);
    }
  }

  /**
   * Checks whether the user has an valid auth
   * @param {*} token The JWT token of the user
   * @returns Whether the user is successfully logged in
   */
  async checkAuth(token) {
    try {
      const promise = await fetch(
        this.buildRequest("auth", "POST", null, token),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not authenticate", err);
    }
  }

  /**
   * Request to change the password
   * @param {*} name The username of the user
   * @returns An email to the user
   */
  async forgotPassword(name) {
    try {
      const promise = await fetch(
        this.buildRequest("auth/forgotPassword", "POST", { name }),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not request a new password", err);
    }
  }

  /**
   * Reset the password of the user
   * @param {*} token The token given by the email
   * @param {*} id The id of the user
   * @param {*} password The new password
   * @param {*} password2 The new password again
   * @returns
   */
  async resetPassword(token, id, password, password2) {
    try {
      const promise = await fetch(
        this.buildRequest("auth/resetPassword", "POST", {
          token,
          id,
          password,
          password2,
        }),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not reset password", err);
    }
  }

  /**
   * Filters all the ads from the database
   * @param {*} filters Object including all the filters
   * @returns All the filtered ads
   */
  async filterAds(filters) {
    try {
      const promise = await fetch(
        this.buildRequest("api/filter/ads", "POST", filters),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not filter ads", err);
    }
  }

  /**
   * Creates a new ad
   * @param {*} ad Object including all attributes of the new ad
   * @returns The new ad
   */
  async createAd(ad) {
    try {
      const promise = await fetch(
        this.buildFormDataRequest("api/ad", "POST", ad, this.fetchToken()),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not create ad", err);
    }
  }

  /**
   * Does the payment via stripe
   * @param {*} id The id of the chosen price
   * @returns Whether the payment was successful
   */
  async doPayment(id) {
    try {
      const promise = await fetch(
        this.buildRequest("pay/checkout", "POST", { id }, this.fetchToken()),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not do payment", err);
    }
  }

  /**
   * Does the payment via twint
   * @param {*} price The chosen price
   * @returns Whether the payment was successful
   */
  async doPaymentViaTwint(price) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "pay/twint/checkout",
          "POST",
          price,
          this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not do payment", err);
    }
  }

  /**
   * Sends a new message to a user
   * @param {*} message The message as a string
   * @param {*} user The user to which the message is sent
   * @returns Whether the message was sent
   */
  async sendMessage(message, user) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "api/message",
          "POST",
          { message, user },
          this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not send message", err);
    }
  }

  /**
   * Creates a new blog post
   * @param {*} blog Object including all attributes of the new blog post
   * @returns The new blog post
   */
  async createBlog(blog) {
    try {
      const promise = await fetch(
        this.buildFormDataRequest("api/blog", "POST", blog, this.fetchToken()),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not create blog", err);
    }
  }

  // PUT REQUESTS

  /**
   * Updates the attributes of the user
   * @param {*} attributes All the attributes of the user
   * @returns Whether the attributes were successfully updated
   */
  async updateUser(attributes) {
    try {
      const promise = await fetch(
        this.buildFormDataRequest(
          "api/user",
          "PUT",
          attributes,
          this.fetchToken(),
        ),
      ).then((res) => res.json());
      if (promise.token) {
        Cookies.set("Auth", JSON.stringify(promise));
      }
      return promise;
    } catch (err) {
      console.error("API: Could not update user", err);
    }
  }

  /**
   * Updates an existing blog post
   * @param {string} id ID of the blog post to update
   * @param {*} attributes Updated blog object including all attributes
   * @returns The updated blog post
   */
  async updateBlog(id, attributes) {
    try {
      const promise = await fetch(
        this.buildFormDataRequest(
          "api/blog/" + id,
          "PUT",
          attributes,
          this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not update blog", err);
    }
  }

  /**
   * Updates the attributes of the ad
   * @param {*} id The id of the ad to be updated
   * @param {*} attributes All the attributes of the ad to be updated
   * @returns Whether the ad was successfully updated
   */
  async updateAd(id, attributes) {
    try {
      const promise = await fetch(
        this.buildFormDataRequest(
          "api/ad/" + id,
          "PUT",
          attributes,
          this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not update ad", err);
    }
  }

  /**
   * Updates the favorite ads of the user
   * @param {*} id The id of the ad to be updated
   * @returns Whether the favorites were successfully updated
   */
  async updateFavorite(id) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "api/favorites/" + id,
          "PUT",
          null,
          this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not update favorites", err);
    }
  }

  /**
   * Updates the subscriptions of the user
   * @param {*} id The id of the user to be updated
   * @returns Whether the subscriptions were successfully updated
   */
  async updateSub(id) {
    try {
      const promise = await fetch(
        this.buildRequest("api/subs/" + id, "PUT", null, this.fetchToken()),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not update subscriptions", err);
    }
  }

  /**
   * Verifies the user
   * @param {*} id The id of the user to be verified
   * @returns Whether the user was successfully verified
   */
  async verifyUser(id) {
    try {
      const promise = await fetch(
        this.buildRequest("api/user/verify/" + id, "PUT", null),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not verify user", err);
    }
  }

  /**
   * Verifies the ad
   * @param {*} id The id of the ad to be verified
   * @returns Whether the ad was successfully verified
   */
  async verifyAd(id) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "api/ad/verify/" + id,
          "PUT",
          null,
          this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not verify ad", err);
    }
  }

  /**
   * Deactivates the ad
   * @param {*} id The id of the ad to be deactivated
   * @returns Whether the ad was successfully deactivated
   */
  async deactivateAd(id) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "api/ad/deactivate/" + id,
          "PUT",
          null,
          this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not deactivate ad", err);
    }
  }

  /**
   * Activates the ad
   * @param {*} id The id of the ad to be deactivated
   * @returns Whether the ad was successfully deactivated
   */
  async activateAd(id) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "api/ad/activate/" + id,
          "PUT",
          null,
          this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not activate ad", err);
    }
  }

  /**
   * Set an ad as premium for the day
   * @param {*} id The id of the ad to be set as premium
   * @returns Whether the ad was successfully set as premium
   */
  async premiumAd(id) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "api/ad/premium/" + id,
          "PUT",
          null,
          this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not set ad as premium", err);
    }
  }

  /**
   * Boost the ad to the top of the list
   * @param {*} id The id of the ad to be boosted
   * @returns Whether the ad was successfully boosted
   */
  async boostAd(id) {
    try {
      const promise = await fetch(
        this.buildRequest("api/ad/boost/" + id, "PUT", null, this.fetchToken()),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not boost ad", err);
    }
  }

  /**
   * Reactivate the ad
   * @param {*} id The id of the ad to be reactivated
   * @param {*} durationId The id of the duration for which the ad needs be reactivated
   * @returns Whether the ad was successfully reactivated
   */
  async reactivateAd(id, durationId) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "api/ad/reactivate/" + id + "/" + durationId,
          "PUT",
          null,
          this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not reactivate ad", err);
    }
  }

  /**
   * Delete an ad
   * @param {*} id The id of the ad to be deleted
   * @returns The deleted ad object, if successful
   */
  async deleteAd(id) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "api/ad/delete/" + id,
          "DELETE",
          null,
          this.fetchToken(),
        ),
      ).then((res) => res.json());
      if (promise.ok) {
        return promise.ad;
      }
    } catch (err) {
      console.error("API: Could not delete ad", err);
    }
  }

  /**
   * Delete a blog post
   * @param {*} id The of the blog post to be deleted
   * @returns Whether the blog post was successfully deleted
   */
  async deleteBlog(id) {
    try {
      const promise = await fetch(
        this.buildRequest(
          "api/blog/delete/" + id,
          "DELETE",
          null,
          this.fetchToken(),
        ),
      ).then((res) => res.json());
      return promise;
    } catch (err) {
      console.error("API: Could not delete blog post", err);
    }
  }
}
