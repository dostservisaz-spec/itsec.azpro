import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Users, Target, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Təhlükəsizlik',
      description: 'Ən yüksək keyfiyyət standartlarına cavab verən etibarlı avadanlıqlar.'
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Müştəri Məmnuniyyəti',
      description: 'Hər bir müştərimizə fərdi yanaşma və peşəkar xidmət.'
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: 'İnnovasiya',
      description: 'Ən son texnologiya nailiyyətlərinin müştərilərimizə təqdim edilməsi.'
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
      title: 'Zəmanət',
      description: 'Bütün məhsullarımıza rəsmi istehsalçı zəmanəti.'
    }
  ];

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Haqqımızda</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
          <p className="text-xl text-muted-foreground text-center mb-10 text-pretty">
            İTSEC AZ - Azərbaycanda təhlükəsizlik sistemləri və müşahidə avadanlıqlarının 
            satışı üzrə ixtisaslaşmış professional e-ticarət platformasıdır.
          </p>
          
          <div className="grid md:grid-cols-2 gap-10 my-12">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Bizim Missiyamız</h2>
              <p>
                Məqsədimiz ölkəmizdə ən müasir, etibarlı və innovativ təhlükəsizlik 
                həllərini əlçatan etməkdir. Biz yalnız məhsul satmır, eyni zamanda 
                müştərilərimizin təhlükəsizliyini və rahatlığını təmin edən kompleks 
                həllər təklif edirik.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Texniki Dəstək</h2>
              <p>
                Layihələrinizin uğurla həyata keçirilməsi üçün professional texniki 
                dəstək komandamız hər zaman xidmətinizdədir. İnformasiya texnologiyaları 
                üzrə mütəxəssis Təbriz İbrahimovun rəhbərliyi ilə komandamız istənilən 
                mürəkkəb layihənin öhdəsindən gəlməyə hazırdır.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-10 text-center">Dəyərlərimiz</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {values.map((value, idx) => (
            <div key={idx} className="p-6 border rounded-xl bg-card">
              <div className="mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-muted p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">Əməkdaşlıq Üçün</h2>
          <p className="mb-6 text-muted-foreground max-w-2xl mx-auto">
            Topdan satış, dilerlik və korporativ əməkdaşlıq üçün bizimlə əlaqə saxlayın.
            Sizə ən sərfəli şərtləri təklif etməyə hazırıq.
          </p>
          <a href="https://wa.me/994776117780" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8">
            Bizimlə Əlaqə
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
