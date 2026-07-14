import { FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const QUICK_LINKS = [
  { label: 'Início', href: '#hero' },
  { label: 'Sobre nós', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Método de trabalho', href: '#metodo' },
  { label: 'Projetos', href: '#projetos' },
  { label: 'Contactos', href: '#contactos' },
];

const SERVICE_LINKS = [
  'Construção civil',
  'Remodelações',
  'Canalização',
  'Eletricidade',
  'Pintura',
  'Carpintaria',
];

const FOOTER_CONTACTS = [
  { icon: FaPhone, label: 'Telefone', value: '+351 919 233 372' },
  { icon: FaWhatsapp, label: 'WhatsApp', value: '+351 919 233 372' },
  { icon: FaEnvelope, label: 'E-mail', value: 'mendes3pm@gmail.com' },
  { icon: FaMapMarkerAlt, label: 'Área', value: 'Portugal Continental' },
];

export function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-300">
      {/* Main footer */}
      <div className="container-wide py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#hero" className="inline-block mb-4 no-underline">
              <img
                src="/logo-lmdreams.png"
                alt="LMDreams - Construção Civil"
                className="h-12 w-auto"
              />
            </a>
            <p className="text-sm text-brand-400 leading-relaxed mb-6">
              Empresa de construção civil com mais de 20 anos de experiência.
              Profissionais especializados para cada etapa da sua obra.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-600 text-white uppercase tracking-wider mb-4">
              Links rápidos
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-brand-400 hover:text-gold-400 transition-colors no-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-600 text-white uppercase tracking-wider mb-4">
              Serviços
            </h4>
            <ul className="space-y-2.5">
              {SERVICE_LINKS.map((service) => (
                <li key={service}>
                  <a
                    href="#servicos"
                    className="text-sm text-brand-400 hover:text-gold-400 transition-colors no-underline"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-sm font-600 text-white uppercase tracking-wider mb-4">
              Contactos
            </h4>
            <ul className="space-y-3">
              {FOOTER_CONTACTS.map((contact) => {
                const Icon = contact.icon;
                return (
                  <li key={contact.label} className="flex items-start gap-3">
                    <Icon className="text-gold-500 text-sm mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-brand-500">{contact.label}</p>
                      <p className="text-sm text-brand-300">{contact.value}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-wide py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-500">
            <p>&copy; {new Date().getFullYear()} LMDreams. Todos os direitos reservados.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <a href="#politica-privacidade" className="hover:text-gold-400 transition-colors no-underline">
                Política de Privacidade
              </a>
              <a href="#politica-cookies" className="hover:text-gold-400 transition-colors no-underline">
                Política de Cookies
              </a>
              <a href="#termos-condicoes" className="hover:text-gold-400 transition-colors no-underline">
                Termos e Condições
              </a>
              <a
                href="https://www.livroreclamacoes.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-400 transition-colors no-underline"
              >
                Livro de Reclamações
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
