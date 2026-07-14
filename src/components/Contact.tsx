import { useState } from 'react';
import { useInView } from '../hooks/useInView';
import { services } from '../data/services';
import { FaPaperPlane, FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const SERVICE_TYPES = [
  { value: '', label: 'Selecionar tipo de serviço...' },
  ...services.map((s) => ({ value: s.id, label: s.title })),
  { value: 'outro', label: 'Outro' },
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    service: '',
    budget: '',
    message: '',
    consent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const { ref, isVisible } = useInView({ threshold: 0.05 });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission — connect to your preferred service
    // e.g. EmailJS, Formspree, or a custom API endpoint
    console.log('Form data:', formData);
    setSubmitted(true);
  };

  return (
    <section id="contactos" className="section-padding bg-white" ref={ref}>
      <div className="container-wide">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left — Info */}
          <div className="lg:col-span-2">
            <span className="section-label">Contactos</span>
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-heading text-brand-900 mb-6 transition-all duration-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
            >
              Vamos falar
              <br />
              <span className="text-gold-500">sobre o seu projeto.</span>
            </h2>
            <p
              className={`text-brand-600 leading-relaxed mb-10 transition-all duration-600 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
            >
              Preencha o formulário ou contacte-nos diretamente. Analisaremos o seu projeto e
              apresentaremos uma solução à medida.
            </p>

            {/* Contact details */}
            <div
              className={`space-y-5 transition-all duration-600 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
            >
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center shrink-0">
                  <FaPhone className="text-gold-600 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-600 text-brand-700 mb-0.5">Telefone</p>
                  <p className="text-brand-400 text-sm">+351 919 233 372</p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center shrink-0">
                  <FaWhatsapp className="text-gold-600 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-600 text-brand-700 mb-0.5">WhatsApp</p>
                  <p className="text-brand-400 text-sm">+351 919 233 372</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center shrink-0">
                  <FaEnvelope className="text-gold-600 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-600 text-brand-700 mb-0.5">E-mail</p>
                  <p className="text-brand-400 text-sm">mendes3pm@gmail.com</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt className="text-gold-600 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-600 text-brand-700 mb-0.5">Área geográfica</p>
                  <p className="text-brand-400 text-sm">Portugal Continental</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div
            className={`lg:col-span-3 transition-all duration-600 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transition: 'opacity 0.6s ease, transform 0.6s ease' }}
          >
            {submitted ? (
              <div className="bg-stone-50 border border-brand-200 rounded-sm p-10 text-center">
                <FaPaperPlane className="text-accent-500 text-3xl mx-auto mb-4" />
                <h3 className="text-xl font-heading text-brand-900 mb-2">
                  Mensagem enviada com sucesso!
                </h3>
                <p className="text-brand-500">
                  Entraremos em contacto consigo brevemente.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-stone-50 border border-brand-100 rounded-sm p-8 md:p-10"
                noValidate
              >
                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-500 text-brand-700 mb-1.5">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-brand-200 rounded-sm text-sm text-brand-800 bg-white placeholder:text-brand-400 focus:outline-none focus:border-accent-400 transition-colors"
                      placeholder="O seu nome"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-500 text-brand-700 mb-1.5">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-brand-200 rounded-sm text-sm text-brand-800 bg-white placeholder:text-brand-400 focus:outline-none focus:border-accent-400 transition-colors"
                      placeholder="O seu telefone"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-500 text-brand-700 mb-1.5">
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-brand-200 rounded-sm text-sm text-brand-800 bg-white placeholder:text-brand-400 focus:outline-none focus:border-accent-400 transition-colors"
                      placeholder="O seu e-mail"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-500 text-brand-700 mb-1.5">
                      Localização da obra
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-brand-200 rounded-sm text-sm text-brand-800 bg-white placeholder:text-brand-400 focus:outline-none focus:border-accent-400 transition-colors"
                      placeholder="Freguesia, concelho ou morada"
                    />
                  </div>
                </div>

                {/* Service type */}
                <div className="mb-5">
                  <label htmlFor="service" className="block text-sm font-500 text-brand-700 mb-1.5">
                    Tipo de serviço
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-brand-200 rounded-sm text-sm text-brand-800 bg-white focus:outline-none focus:border-accent-400 transition-colors"
                  >
                    {SERVICE_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget hint */}
                <div className="mb-5">
                  <label htmlFor="budget" className="block text-sm font-500 text-brand-700 mb-1.5">
                    Orçamento estimado (opcional)
                  </label>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-brand-200 rounded-sm text-sm text-brand-800 bg-white placeholder:text-brand-400 focus:outline-none focus:border-accent-400 transition-colors"
                    placeholder="Ex: 5 000 € - 15 000 €"
                  />
                </div>

                {/* Message */}
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-500 text-brand-700 mb-1.5">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-brand-200 rounded-sm text-sm text-brand-800 bg-white placeholder:text-brand-400 focus:outline-none focus:border-accent-400 transition-colors resize-y"
                    placeholder="Descreva o seu projeto ou as suas necessidades..."
                  />
                </div>

                {/* Consent */}
                <div className="mb-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      required
                      className="mt-1 shrink-0 text-accent-600 focus:ring-accent-500"
                    />
                    <span className="text-sm text-brand-500 leading-relaxed">
                      Li e aceito a{' '}
                      <a href="#politica-privacidade" className="text-gold-600 underline hover:text-red-700">
                        Política de Privacidade
                      </a>{' '}
                      e autorizo o tratamento dos meus dados para efeitos de resposta a este pedido de contacto. *
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-full justify-center text-base py-3.5 gap-2"
                >
                  <FaPaperPlane size={14} />
                  Enviar pedido de orçamento
                </button>

                <p className="text-xs text-brand-400 mt-4 text-center">
                  Os campos assinalados com * são de preenchimento obrigatório.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
