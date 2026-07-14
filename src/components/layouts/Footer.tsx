import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 mb-16">
          {/* Logo & Description */}
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="inline-block">
              <span className="font-black text-2xl tracking-tighter text-foreground uppercase">İT<span className="text-primary">SEC</span>.AZ</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Professional security systems distributor. Official partner of Hikvision, Dahua, TP-Link, and other leading brands.
            </p>
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <span className="w-4 h-4 rounded-full border-2 border-primary mr-2 flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
              </span>
              Official Authorized Distributor
            </div>

            <div className="pt-6 space-y-4">
              <h3 className="font-semibold text-lg flex items-center before:w-1 before:h-4 before:bg-primary before:mr-2">Əlaqə</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <a href="tel:+994776117780" className="hover:text-primary">+994 77 611 77 80</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <a href="mailto:info@itsecurity.az" className="hover:text-primary">info@itsecurity.az</a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Baku, Azadliq prospekti 143</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>09:00-18:00 (Mon-Sat)</span>
                </li>
              </ul>
              
              <Button className="bg-[#1E7C45] hover:bg-[#156035] text-white w-full max-w-[240px] mt-4" asChild>
                <a href="https://wa.me/994776117780" target="_blank" rel="noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                  </svg>
                  WhatsApp Order
                </a>
              </Button>
            </div>
          </div>

          {/* Products */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="font-semibold text-lg flex items-center before:w-1 before:h-4 before:bg-primary before:mr-2">Products</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/products?category=ip-cameras" className="hover:text-primary">IP Kameralar</Link></li>
              <li><Link to="/products?category=analog" className="hover:text-primary">Analog Kameralar</Link></li>
              <li><Link to="/products?category=dvr-nvr" className="hover:text-primary">DVR / NVR</Link></li>
              <li><Link to="/products?category=poe" className="hover:text-primary">PoE Açarlar</Link></li>
              <li><Link to="/products?category=access" className="hover:text-primary">Giriş Nəzarəti</Link></li>
              <li><Link to="/products?category=ptz" className="hover:text-primary">PTZ Kameralar</Link></li>
              <li><Link to="/products?category=alarms" className="hover:text-primary">Həyəcan Sistemləri</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="font-semibold text-lg flex items-center before:w-1 before:h-4 before:bg-primary before:mr-2">Services</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/tools" className="hover:text-primary">Smart Tools</Link></li>
              <li><Link to="/wholesale" className="hover:text-primary">Topdancı Proqramı</Link></li>
              <li><Link to="/blog" className="hover:text-primary">Blog & News</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Əlaqə</Link></li>
              <li><Link to="/about" className="hover:text-primary">Haqqımızda</Link></li>
              <li><Link to="/privacy" className="hover:text-primary">Gizlilik</Link></li>
            </ul>
          </div>

          {/* Scan to Visit */}
          <div className="md:col-span-2 space-y-6">
            <h3 className="font-semibold text-lg flex items-center before:w-1 before:h-4 before:bg-primary before:mr-2">Scan to Visit</h3>
            <div className="bg-white p-3 rounded-lg border inline-block">
              {/* Dummy QR code using a placeholder or SVG */}
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://itsec.az&color=cc0000" alt="QR Code" className="w-24 h-24" />
            </div>
            <div className="text-center w-full max-w-[120px]">
              <a href="#" className="text-xs text-muted-foreground hover:text-primary flex items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download QR
              </a>
              <p className="text-[10px] text-muted-foreground mt-1">https://itsec.az</p>
            </div>
          </div>
        </div>

        {/* Brands Bottom Bar */}
        <div className="border-t pt-8 pb-4">
          <div className="text-center mb-6">
            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Rəsmi Distribyutor</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
            {['HIKVISION', 'DAHUA', 'TP-LINK', 'CISCO', 'AVITEL', 'RVI'].map(brand => (
              <span key={brand} className="text-sm font-bold text-foreground">{brand}</span>
            ))}
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className="flex justify-between items-center pt-8 text-xs text-muted-foreground">
          <p>Protected by Jozef</p>
          <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
            by Medo X
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
