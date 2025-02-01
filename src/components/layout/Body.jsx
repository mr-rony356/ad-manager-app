import React from "react";
import ResetPasswordForm from "@components/forms/ResetPasswordForm";
import AdvertisementPage from "@pages/ad";
import AdminPage from "@pages/admin";
import AdDetail from "@pages/admin/ad/[id]/[slug]";
import CreditForm from "@pages/admin/credits";
import Favorites from "@pages/admin/favorites";
import AdManager from "@pages/admin/manager";
import Chat from "@pages/admin/messages/[id]";
import Messages from "@pages/admin/messages/index.js";
import HomePage from "@pages/admin/pay/sucess";
import Settings from "@pages/admin/settings";
import Verifications from "@pages/admin/verifications";
import BlogCreate from "@pages/blog";
import BlogDetail from "@pages/blog/[id]/[slug]";
import BlogList from "@pages/blogs";
import Imprint from "@pages/imprint";
import LoginPage from "@pages/loginPage";
import PageAGB from "@pages/pageAgb";
import Support from "@pages/support";
import Privacy from "@pages/privacy";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@components/ui/toaster";
import AdPricePage from "@pages/ad-price";

const Body = (props) => {
  const { user, setUser } = props;

  return (
    <>
      <Routes>
        <Route path="/">
          <Route path="" element={<HomePage user={user} setUser={setUser} />} />
          <Route
            path="filter/*"
            element={<HomePage user={user} setUser={setUser} />}
          />
          <Route path="/resetPassword" element={<ResetPasswordForm />} />
          <Route
            path="/verify"
            element={
              <HomePage
                tempDisplayModal="verified"
                user={user}
                setUser={setUser}
              />
            }
          />
        </Route>
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/admin">
          <Route
            path=""
            element={<AdminPage user={user} setUser={setUser} />}
          />
          <Route
            path="manager"
            element={<AdManager user={user} setUser={setUser} />}
          />
          <Route
            path="credits"
            element={<CreditForm user={user} setUser={setUser} />}
          />
          <Route path="messages">
            <Route
              path=""
              element={<Messages user={user} setUser={setUser} />}
            />
            <Route
              path=":id"
              element={<Chat user={user} setUser={setUser} />}
            />
          </Route>
          <Route path="verifications" element={<Verifications />} />
          <Route
            path="favorites"
            element={<Favorites user={user} setUser={setUser} />}
          />
          <Route
            path="settings"
            element={<Settings user={user} setUser={setUser} />}
          />
          <Route path="ad/:id/:slug" element={<AdDetail user={user} />} />
          <Route
            path="pay/success"
            element={
              <HomePage
                tempDisplayModal={"payment"}
                user={user}
                setUser={setUser}
              />
            }
          />
          <Route
            path="pay/twint/success"
            element={
              <HomePage
                tempDisplayModal={"twint"}
                user={user}
                setUser={setUser}
              />
            }
          />
        </Route>
        <Route path="/ad">
          <Route path="" element={<AdvertisementPage />} />
          <Route path=":id/:slug" element={<AdDetail user={user} />} />
          <Route
            path="uploaded"
            element={
              <HomePage
                tempDisplayModal={"upload"}
                user={user}
                setUser={setUser}
              />
            }
          />
        </Route>
        <Route path="/blog">
          <Route path="" element={<BlogCreate />} />
          <Route path=":id/:slug" element={<BlogDetail user={user} />} />
        </Route>
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/pageSupport" element={<Support />} />
        <Route path="/pageAgb" element={<PageAGB />} />
        <Route path="/imprint" element={<Imprint />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/ad-price" element={<AdPricePage />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default Body;
