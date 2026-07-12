import Link from "next/link";
import { MapPin, Phone, Clock, Globe, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <span className="text-2xl">🍦</span>
              <span>Gelato & Sorvetes</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Os melhores sorvetes artesanais da cidade. Feitos com amor e ingredientes naturais.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cardápio
                </Link>
              </li>
              <li>
                <Link href="/catalog?featured=true" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Destaques
                </Link>
              </li>
              <li>
                <Link href="/catalog?promotion=true" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Promoções
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Rua Example, 123 - Centro
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                (11) 99999-9999
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Seg-Sex: 09:00-22:00
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Visite nosso Instagram"
              >
                <Globe className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://wa.me/558896357773"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Fale conosco pelo WhatsApp"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Gelato & Sorvetes. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
