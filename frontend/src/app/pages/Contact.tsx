import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react";
import { submitContact } from "../lib/api";
import { FadeIn } from "../components/shared";

type ContactForm = { nom: string; email: string; telephone: string; message: string };

function validateContact(f: ContactForm): Record<string, string> {
  const e: Record<string, string> = {};
  if (!f.nom.trim()) e.nom = "Le nom est requis.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Email invalide.";
  if (f.telephone && !f.telephone.match(/^[0-9]{8}$/))
    e.telephone = "Numéro invalide — 8 chiffres attendus.";
  if (!f.message.trim() || f.message.trim().length < 10)
    e.message = "Message trop court (10 caractères minimum).";
  return e;
}

export default function Contact() {
  const empty: ContactForm = { nom: "", email: "", telephone: "", message: "" };
  const [form, setForm] = useState<ContactForm>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const touch = (name: string) =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  const fieldCls = (name: string) =>
    `w-full px-4 py-3 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
      touched[name] && errors[name]
        ? "border-destructive focus:ring-destructive/30"
        : "border-border focus:ring-primary/30 focus:border-primary"
    }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setTouched({ nom: true, email: true, message: true });
    const errs = validateContact(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const result = await submitContact(form);
    setSubmitting(false);
    if (result.ok) setSent(true);
    else setServerError(result.message);
  };

  return (
    <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-br from-secondary to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Nous contacter
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Contact
            </h1>
          </FadeIn>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12">
          {/* Info col */}
          <FadeIn from="left" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Informations de contact
            </h2>
            <div className="space-y-3">
              {[
                {
                  icon: MapPin,
                  title: "Adresse",
                  lines: [
                    "Av. Habib Bourguiba",
                    "Téboulba, Monastir, Tunisie",
                  ],
                },
                {
                  icon: Phone,
                  title: "Téléphone",
                  lines: ["73 479 960"],
                  href: "tel:73479960",
                },
                {
                  icon: Mail,
                  title: "Email",
                  lines: ["cabinet.zouid@gmail.com"],
                },
              ].map(({ icon: Icon, title, lines, href }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm mb-0.5">
                      {title}
                    </div>
                    {lines.map((l) =>
                      href ? (
                        <a
                          key={l}
                          href={href}
                          className="block text-muted-foreground text-sm hover:text-primary transition-colors"
                        >
                          {l}
                        </a>
                      ) : (
                        <div
                          key={l}
                          className="text-muted-foreground text-sm"
                        >
                          {l}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="bg-background rounded-2xl border border-border p-6">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Horaires d'ouverture
              </h3>
              <div className="space-y-1.5">
                {[
                  ["Lundi", "8h00 – 18h00"],
                  ["Mardi", "8h00 – 18h00"],
                  ["Mercredi", "8h00 – 18h00"],
                  ["Jeudi", "8h00 – 18h00"],
                  ["Vendredi", "8h00 – 18h00"],
                  ["Samedi", "8h00 – 13h00"],
                  ["Dimanche", "Fermé"],
                ].map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex justify-between text-sm py-1.5 border-b border-border/50 last:border-0"
                  >
                    <span
                      className={
                        day === "Dimanche"
                          ? "text-muted-foreground"
                          : "font-medium text-foreground"
                      }
                    >
                      {day}
                    </span>
                    <span
                      className={
                        day === "Dimanche"
                          ? "text-muted-foreground italic"
                          : "text-primary font-medium"
                      }
                    >
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Maps iframe */}
            <div className="rounded-2xl overflow-hidden border border-border h-56 bg-secondary">
              <iframe
                title="Localisation Cabinet Dr Sonia Zouid — Téboulba"
                src="https://maps.google.com/maps?q=Teboulba,Monastir,Tunisia&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeIn>

          {/* Contact form */}
          <FadeIn from="right">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Envoyez-nous un message
            </h2>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-20 bg-success/5 border border-success/20 rounded-3xl"
              >
                <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">
                  Message envoyé !
                </h3>
                <p className="text-muted-foreground text-sm">
                  Nous vous répondrons dans les meilleurs délais.
                </p>
                <button
                  onClick={() => {
                    setForm(empty);
                    setErrors({});
                    setTouched({});
                    setSent(false);
                  }}
                  className="mt-4 text-primary text-sm font-semibold hover:underline"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    onBlur={() => {
                      touch("nom");
                      setErrors(validateContact({ ...form }));
                    }}
                    className={fieldCls("nom")}
                  />
                  {touched.nom && errors.nom && (
                    <p className="text-destructive text-xs mt-1">{errors.nom}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Adresse e-mail *
                  </label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    onBlur={() => {
                      touch("email");
                      setErrors(validateContact({ ...form }));
                    }}
                    className={fieldCls("email")}
                  />
                  {touched.email && errors.email && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="12 345 678"
                    value={form.telephone}
                    onChange={(e) =>
                      setForm({ ...form, telephone: e.target.value })
                    }
                    onBlur={() => {
                      touch("telephone");
                      setErrors(validateContact({ ...form }));
                    }}
                    className={fieldCls("telephone")}
                  />
                  {touched.telephone && errors.telephone && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.telephone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={7}
                    placeholder="Votre message…"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    onBlur={() => {
                      touch("message");
                      setErrors(validateContact({ ...form }));
                    }}
                    className={`${fieldCls("message")} resize-none`}
                  />
                  {touched.message && errors.message && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>
                {serverError && (
                  <p className="text-destructive text-sm text-center bg-destructive/10 rounded-xl py-3 px-4">
                    {serverError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Mail className="w-5 h-5" />
                  {submitting ? "Envoi en cours…" : "Envoyer le message"}
                </button>
              </form>
            )}
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
