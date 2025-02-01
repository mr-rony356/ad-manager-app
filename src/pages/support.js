import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Button } from "@components/ui/button";
import { useToast } from "@components/hooks/use-toast";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"], null, [
        "en",
        "de",
      ])),
    },
  };
}

function Support() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = "E-Mail ist erforderlich";
    if (!formData.subject) newErrors.subject = "Betreff ist erforderlich";
    if (!formData.message) newErrors.message = "Nachricht ist erforderlich";

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          toast({
            title: "Erfolg",
            description: "Ihre Nachricht wurde erfolgreich gesendet.",
            variant: "success",
          });
          setFormData({ email: "", subject: "", message: "" });
        } else {
          throw new Error(data.message || "Error sending message");
        }
      } catch (error) {
        toast({
          title: "Fehler",
          description:
            "Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      {" "}
      <Head>
        <title>Kontakt - onlyfriend.ch</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        {/* ... rest of your meta tags ... */}
      </Head>
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-6">
          <h1 className="text-4xl  text-sky-400  md:text-center font-bold mb-8 my-8">
            Kontakt
          </h1>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto items-center">
            {/* Support Info Card */}
            <Card className="h-fit">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">Support-Hotline</h3>
                <p className="text-gray-600 mb-4">
                  (Montag - Freitag 09:00 - 18:00 Uhr)
                </p>

                <a
                  href="tel:+41772054730"
                  className="block text-blue-600 font-medium mb-4 hover:text-blue-700"
                >
                  Tel. +41 77 205 47 30
                </a>

                <a
                  href="https://wa.me/+41772054730"
                  className="inline-flex items-center gap-2 border-sky-500 border-2  text-sky-500 px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors"
                >
                  <Image
                    src="/assets/whatsapp.png"
                    width={24}
                    height={24}
                    alt="WhatsApp"
                    className="w-6 h-6"
                  />
                  WhatsApp
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      E-Mail Adresse*
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Betreff*
                    </label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className={errors.subject ? "border-red-500" : ""}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nachricht*
                    </label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className={errors.message ? "border-red-500" : ""}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Absenden
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default Support;
