import React, { useState } from "react";
import { motion } from "motion/react";
import {
  MapPin,
  Phone,
  Clock,
  Shield,
  MessageCircle,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { submitAppointment } from "../lib/api";
import { FadeIn } from "../components/shared";

type RdvForm = {
  nom: string;
  telephone: string;
  email: string;
  motif: string;
  date: string;
  heure: string;
  message: string;
};

function validateRdv(f: RdvForm): Record<string, string> {
  const e: Record<string, string> = {};
  if (!f.nom.trim() || f.nom.trim().length < 3)
    e.nom = "Veuillez entrer votre nom complet.";
  if (!f.telephone.match(/^[0-9]{8}$/))
    e.telephone = "Numéro invalide — 8 chiffres attendus.";
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = "Adresse email invalide.";
  if (!f.motif) e.motif = "Veuillez sélectionner un motif.";
  if (!f.date) e.date = "La date est requise.";
  return e;
}

export default function Booking() {
  const emptyForm: RdvForm = {
    nom: "",
    telephone: "",
    email: "",
    motif: "",
    date: "",
    heure: "",
    message: "",
  };
  const [form, setForm] = useState<RdvForm>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const motifs = [
    "Consultation générale",
    "Examen de la vue",
    "Dépistage glaucome",
    "Dépistage cataracte",
    "Prescription lunettes / lentilles",
    "Suivi pédiatrique",
    "Urgences ophtalmologiques",
    "Autre",
  ];

  const touch = (name: string) =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const allTouched = Object.fromEntries(
      Object.keys(form).map((k) => [k, true])
    );
    setTouched(allTouched);
    const errs = validateRdv(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const result = await submitAppointment(form);
    setSubmitting(false);
    if (result.ok) setSubmitted(true);
    else setServerError(result.message);
  };

  const fieldCls = (name: string) =>
    `w-full px-4 py-3 bg-background border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-colors ${
      touched[name] && errors[name]
        ? "border-destructive focus:ring-destructive/30"
        : "border-border focus:ring-primary/30 focus:border-primary"
    }`;

  return (
    <div className="pt-16 lg:pt-20">
      <div className="bg-gradient-to-br from-secondary to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <div className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              Prise en charge rapide
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Prendre rendez-vous
            </h1>
            <p className="text-muted-foreground mt-4 max-w-xl">
              Remplissez le formulaire ci-dessous et nous vous confirmerons
              votre rendez-vous dans les plus brefs délais.
            </p>
          </FadeIn>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-5 gap-12">
          {/* Info sidebar */}
          <FadeIn from="left" className="lg:col-span-2 space-y-5">
            <div className="bg-background rounded-2xl p-6 border border-border">
              <h3 className="font-bold text-foreground mb-4">
                Informations pratiques
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    label: "Adresse",
                    value: "Av. Habib Bourguiba, Téboulba",
                  },
                  {
                    icon: Phone,
                    label: "Téléphone",
                    value: "73 479 960",
                    href: "tel:73479960",
                  },
                  { icon: Clock, label: "Lun – Ven", value: "8h30 – 17h00" },
                  { icon: Clock, label: "Samedi", value: "9h00 – 13h00" },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {label}
                      </div>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <div className="text-sm font-medium text-foreground">
                          {value}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground text-sm mb-1">
                    Confidentialité garantie
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Vos données personnelles sont protégées et utilisées
                    uniquement à des fins médicales, conformément à la
                    réglementation en vigueur.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
              <div className="font-semibold text-foreground text-sm mb-1">
                Disponible sur WhatsApp
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                Pour toute urgence ou question rapide, contactez-nous
                directement via WhatsApp.
              </p>
              <a
                href="https://wa.me/21673479960"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: "#25D366" }}
              >
                <MessageCircle className="w-4 h-4" />
                Écrire sur WhatsApp
              </a>
            </div>
          </FadeIn>

          {/* Form */}
          <FadeIn from="right" className="lg:col-span-3">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center py-20 px-8 bg-success/5 border border-success/20 rounded-3xl"
              >
                <div className="w-16 h-16 bg-success/15 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  Demande envoyée !
                </h3>
                <p className="text-muted-foreground mb-6">
                  Merci, {form.nom}. Nous vous contacterons au{" "}
                  <span className="font-semibold text-foreground">
                    {form.telephone}
                  </span>{" "}
                  pour confirmer votre rendez-vous.
                </p>
                <button
                  onClick={() => {
                    setForm(emptyForm);
                    setErrors({});
                    setTouched({});
                    setSubmitted(false);
                  }}
                  className="text-primary font-semibold text-sm hover:underline"
                >
                  Envoyer une autre demande
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Nom + Téléphone */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      placeholder="Votre nom et prénom"
                      value={form.nom}
                      onChange={(e) =>
                        setForm({ ...form, nom: e.target.value })
                      }
                      onBlur={() => {
                        touch("nom");
                        setErrors(validateRdv({ ...form }));
                      }}
                      className={fieldCls("nom")}
                    />
                    {touched.nom && errors.nom && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.nom}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Téléphone *
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
                        setErrors(validateRdv({ ...form }));
                      }}
                      className={fieldCls("telephone")}
                    />
                    {touched.telephone && errors.telephone && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.telephone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Adresse e-mail
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
                      setErrors(validateRdv({ ...form }));
                    }}
                    className={fieldCls("email")}
                  />
                  {touched.email && errors.email && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Motif */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Motif de consultation *
                  </label>
                  <select
                    value={form.motif}
                    onChange={(e) =>
                      setForm({ ...form, motif: e.target.value })
                    }
                    onBlur={() => {
                      touch("motif");
                      setErrors(validateRdv({ ...form }));
                    }}
                    className={`${fieldCls("motif")} appearance-none cursor-pointer`}
                  >
                    <option value="">Sélectionnez le motif…</option>
                    {motifs.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  {touched.motif && errors.motif && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.motif}
                    </p>
                  )}
                </div>

                {/* Date + Heure */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Date souhaitée *
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      onBlur={() => {
                        touch("date");
                        setErrors(validateRdv({ ...form }));
                      }}
                      className={fieldCls("date")}
                    />
                    {touched.date && errors.date && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.date}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5">
                      Heure préférée
                    </label>
                    <select
                      value={form.heure}
                      onChange={(e) =>
                        setForm({ ...form, heure: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">Indifférent</option>
                      <option value="matin">Matin</option>
                      <option value="apres-midi">Après-midi</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1.5">
                    Message (optionnel)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Précisez votre demande ou symptômes si nécessaire…"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                  />
                </div>

                {serverError && (
                  <p className="text-destructive text-sm text-center bg-destructive/10 rounded-xl py-3 px-4">
                    {serverError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl text-base transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Calendar className="w-5 h-5" />
                  {submitting ? "Envoi en cours…" : "Envoyer ma demande de rendez-vous"}
                </button>
                <p className="text-xs text-center text-muted-foreground">
                  * Champs obligatoires. Nous confirmerons votre rendez-vous
                  par téléphone.
                </p>
              </form>
            )}
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
