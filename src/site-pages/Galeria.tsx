import Header from '../site-components/Header';
import Footer from '../site-components/Footer';
import { useState } from 'react';
import { X } from 'lucide-react';

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeLimo, setActiveLimo] = useState("Todas");

  const images = [
    {
      id: 1,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748390546/Screenshot_from_2025-05-27_20-59-32_shftii.png",
      alt: "Limousine 300C Crysler Exterior - King Limousines",
      category: "Exterior",
      limo: "300C Crysler"
    },
    {
      id: 2,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748390546/Screenshot_from_2025-05-27_21-00-21_uzmd3k.png",
      alt: "Limousine 300C Crysler Interior - King Limousines",
      category: "Interior",
      limo: "300C Crysler"
    },
    {
      id: 3,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748390547/Screenshot_from_2025-05-27_21-01-07_uukzoq.png",
      alt: "Evento de casamento Limousine 300c Crysler - King Limousines",
      category: "Eventos",
      limo: "300C Crysler"
    },
    {
      id: 4,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748390546/Screenshot_from_2025-05-27_21-00-50_vbrqfc.png",
      alt: "Festa de 15 anos Limousine 300c Crysler - King Limousines",
      category: "Eventos",
      limo: "300C Crysler"
    },
    {
      id: 5,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748390546/Screenshot_from_2025-05-27_21-00-57_p9lps3.png",
      alt: "Evento de casamento Limousine 300c Crysler - King Limousines",
      category: "Eventos",
      limo: "300C Crysler"
    },
    {
      id: 6,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748390546/Screenshot_from_2025-05-27_21-01-01_fbt4hp.png",
      alt: "Evento de casamento Limousine 300c Crysler - King Limousines",
      category: "Eventos",
      limo: "300C Crysler"
    },
    {
      id: 7,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748390546/Screenshot_from_2025-05-27_21-00-35_qm07h2.png",
      alt: "Limousine 300c Crysler Interior - King Limousines",
      category: "Interior",
      limo: "300C Crysler"
    },
    {
      id: 8,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748397728/456a769b-c221-4f28-a553-7300cf44c00e_au0sw8.jpg",
      alt: "Limousine Gigante Exterior - King Limousines",
      category: "Exterior",
      limo: "Nossa Gigante"
    },
    {
      id: 9,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393202/Screenshot_from_2025-05-27_21-46-35_wpvvyr.png",
      alt: "Limousine Gigante Exterior - King Limousines",
      category: "Exterior",
      limo: "Nossa Gigante"
    },
    {
      id: 10,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748392886/Screenshot_from_2025-05-27_21-16-00_wooyxx.png",
      alt: "Limousine Gigante Exterior - King Limousines",
      category: "Exterior",
      limo: "Nossa Gigante"
    },
    {
      id: 11,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748392884/Screenshot_from_2025-05-27_21-15-56_wakhxq.png",
      alt: "Limousine Gigante Exterior - King Limousines",
      category: "Exterior",
      limo: "Nossa Gigante"
    },
    {
      id: 12,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391501/Screenshot_from_2025-05-27_21-16-55_mftkph.png",
      alt: "Casamento Limousine Limousine Nossa Gigante - King Limousines",
      category: "Eventos",
      limo: "Nossa Gigante"
    },
    {
      id: 13,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391500/Screenshot_from_2025-05-27_21-16-48_a5uw6h.png",
      alt: "Festa das meninas Limousine Nossa Gigante - King Limousines",
      category: "Eventos",
      limo: "Nossa Gigante"
    },
    {
      id: 14,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391498/Screenshot_from_2025-05-27_21-16-33_zocwxq.png",
      alt: "Exterior Limousine Nossa Gigante - King Limousines",
      category: "Exterior",
      limo: "Nossa Gigante"
    },
    {
      id: 15,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391496/Screenshot_from_2025-05-27_21-16-26_mjtyhq.png",
      alt: "Festa de aniversário Limousine Nossa Gigante - King Limousines",
      category: "Eventos",
      limo: "Nossa Gigante"
    },
    {
      id: 16,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391498/Screenshot_from_2025-05-27_21-16-44_rotxmx.png",
      alt: "Interior Limousine Nossa Gigante - King Limousines",
      category: "Interior",
      limo: "Nossa Gigante"
    },
    {
      id: 17,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391496/Screenshot_from_2025-05-27_21-16-26_mjtyhq.png",
      alt: "Festa de 15 anos Limousine Nossa Gigante - King Limousines",
      category: "Eventos",
      limo: "Nossa Gigante"
    },
    {
      id: 18,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391494/Screenshot_from_2025-05-27_21-16-19_rfcaq8.png",
      alt: "Festa de aniversário infantil Limousine Nossa Gigante - King Limousines",
      category: "Eventos",
      limo: "Nossa Gigante"
    },
    {
      id: 19,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391494/Screenshot_from_2025-05-27_21-16-12_aw58u3.png",
      alt: "Casamento Limousine Nossa Gigante - King Limousines",
      category: "Eventos",
      limo: "Nossa Gigante"
    },
    {
      id: 20,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748391493/Screenshot_from_2025-05-27_21-16-06_hcywzx.png",
      alt: "Festa de 15 anos Limousine Nossa Gigante - King Limousines",
      category: "Eventos",
      limo: "Nossa Gigante"
    },
    {
      id: 21,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394701/fc143c23-a498-4818-b53b-c857f6d58c74_fixrty.jpg",
      alt: "Festa Limousine RAM Black - King Limousines",
      category: "Eventos",
      limo: "Black"
    },
    {
      id: 22,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394700/c83c2e13-a43f-448a-8bb4-153493ddcaa7_mdkr41.jpg",
      alt: "Festa Limousine RAM Black - King Limousines",
      category: "Eventos",
      limo: "Black"
    },
    {
      id: 23,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394648/387df8c1-899d-4b91-b44c-2cb0f5d8a295_ksbqgy_52b99e.jpg",
      alt: "Despedida de solteira Limousine RAM Black - King Limousines",
      category: "Eventos",
      limo: "Black"
    },
    {
      id: 24,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394503/Screenshot_from_2025-05-27_21-57-24_prko93_183d86.png",
      alt: "Festa de 15 anos Limousine RAM Black - King Limousines",
      category: "Eventos",
      limo: "Black"
    },
    {
      id: 25,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394447/Screenshot_from_2025-05-27_21-57-18_xltraf_57e5d7.png",
      alt: "Exterior Limousine RAM Black - King Limousines",
      category: "Exterior",
      limo: "Black"
    },
    {
      id: 26,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394064/Screenshot_from_2025-05-27_21-58-42_iv5isv.png",
      alt: "Evento Limousine RAM Black - King Limousines",
      category: "Eventos",
      limo: "Black"
    },
    {
      id: 27,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394064/Screenshot_from_2025-05-27_21-58-59_v1ywt2.png",
      alt: "Evento/Confraternização Limousine RAM Black - King Limousines",
      category: "Eventos",
      limo: "Black"
    },
    {
      id: 28,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394064/Screenshot_from_2025-05-27_21-59-18_l8oucm.png",
      alt: "Exterior Limousine RAM Black - King Limousines",
      category: "Exterior",
      limo: "Black"
    },
    {
      id: 29,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394064/Screenshot_from_2025-05-27_21-59-28_u9rbze.png",
      alt: "Exterior Limousine RAM Black - King Limousines",
      category: "Exterior",
      limo: "Black"
    },
    {
      id: 30,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394063/Screenshot_from_2025-05-27_21-58-22_r2mgk9.png",
      alt: "Evento Limousine RAM Black - King Limousines",
      category: "Eventos",
      limo: "Black"
    },
    {
      id: 31,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394063/Screenshot_from_2025-05-27_21-57-34_hrljik.png",
      alt: "Evento Aniversario Infantil Limousine RAM Black - King Limousines",
      category: "Eventos",
      limo: "Black"
    },
    {
      id: 32,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394063/Screenshot_from_2025-05-27_21-58-34_laj8sc.png",
      alt: "Interior Limousine RAM Black - King Limousines",
      category: "Interior",
      limo: "Black"
    },
    {
      id: 33,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394063/Screenshot_from_2025-05-27_21-56-48_qleehm.png",
      alt: "Exterior Limousine RAM Black - King Limousines",
      category: "Exterior",
      limo: "Black"
    },
    {
      id: 34,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748394063/Screenshot_from_2025-05-27_21-58-47_sbnnur.png",
      alt: "Exterior Limousine RAM Black - King Limousines",
      category: "Exterior",
      limo: "Black"
    },
    {
      id: 35,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393474/Screenshot_from_2025-05-27_21-48-58_jiczl8.png",
      alt: "Exterior Limousine PT Crysler Rosa - King Limousines",
      category: "Exterior",
      limo: "PT Crysler"
    },
    {
      id: 36,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393479/Screenshot_from_2025-05-27_21-49-21_xd52jn.png",
      alt: "Exterior Limousine PT Crysler Rosa - King Limousines",
      category: "Exterior",
      limo: "PT Crysler"
    },
    {
      id: 37,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393476/Screenshot_from_2025-05-27_21-49-07_r36c6f.png",
      alt: "Exterior Limousine PT Crysler Rosa - King Limousines",
      category: "Exterior",
      limo: "PT Crysler"
    },
    {
      id: 38,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393478/Screenshot_from_2025-05-27_21-49-15_kmlgve.png",
      alt: "Interior Limousine PT Crysler Rosa - King Limousines",
      category: "Interior",
      limo: "PT Crysler"
    },
    {
      id: 39,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393481/Screenshot_from_2025-05-27_21-49-31_k1vyxi.png",
      alt: "Interior Limousine PT Crysler Rosa - King Limousines",
      category: "Interior",
      limo: "PT Crysler"
    },
    {
      id: 40,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393483/Screenshot_from_2025-05-27_21-49-34_otxdhu.png",
      alt: "Interior Limousine PT Crysler Rosa - King Limousines",
      category: "Interior",
      limo: "PT Crysler"
    },
    {
      id: 41,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393484/Screenshot_from_2025-05-27_21-49-42_sgruu5.png",
      alt: "Festa de 15 anos Limousine PT Crysler Rosa - King Limousines",
      category: "Eventos",
      limo: "PT Crysler"
    },
    {
      id: 42,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393487/Screenshot_from_2025-05-27_21-49-44_r4dgin.png",
      alt: "Festa de 15 anos Limousine PT Crysler Rosa - King Limousines",
      category: "Eventos",
      limo: "PT Crysler"
    },
    {
      id: 43,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393489/Screenshot_from_2025-05-27_21-49-47_qru6yi.png",
      alt: "Festa de 15 anos Limousine PT Crysler Rosa - King Limousines",
      category: "Eventos",
      limo: "PT Crysler"
    },
    {
      id: 44,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393491/Screenshot_from_2025-05-27_21-49-51_gzql7n.png",
      alt: "Festa de 15 anos Limousine PT Crysler Rosa - King Limousines",
      category: "Eventos",
      limo: "PT Crysler"
    },
    {
      id: 45,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393493/Screenshot_from_2025-05-27_21-50-06_gpdxsj.png",
      alt: "Festa de 15 anos Limousine PT Crysler Rosa - King Limousines",
      category: "Eventos",
      limo: "PT Crysler"
    },
    {
      id: 46,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393499/Screenshot_from_2025-05-27_21-50-14_pu5fel.png",
      alt: "Festa de 15 anos Limousine PT Crysler Rosa - King Limousines",
      category: "Eventos",
      limo: "PT Crysler"
    },
    {
      id: 47,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748393500/Screenshot_from_2025-05-27_21-50-16_qja6ef.png",
      alt: "Festa de 15 anos Limousine PT Crysler Rosa - King Limousines",
      category: "Eventos",
      limo: "PT Crysler"
    },
    {
      id: 49,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748565154/8b858263-f942-4d70-8bdd-e95633641158_pzus4h.jpg",
      alt: "Espaco Kids - King Limousines",
      category: "Kids",
      limo: "PT Crysler"
    },
    {
      id: 50,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748565154/3342e93c-b697-4a58-a679-c10dc3d14dc7_wiitau.jpg",
      alt: "Espaco Kids - King Limousines",
      category: "Kids",
      limo: "PT Crysler"
    },
    {
      id: 51,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748565154/7f21628a-de9d-4bc9-aa36-b8ce181577ee_gmekym.jpg",
      alt: "Espaco Kids - King Limousines",
      category: "Kids",
      limo: "PT Crysler"
    },
    {
      id: 52,
      src: "https://res.cloudinary.com/dcnowyew6/image/upload/v1748565155/ff808da4-9024-4a64-a132-6f621926bea2_jhqlkh.jpg",
      alt: "Espaco Kids - King Limousines",
      category: "Kids",
      limo: "PT Crysler"
    },
  ];

  const categories = ["Todos", "Exterior", "Interior", "Eventos", "Kids"];
  const limoTypes = ["Todas", "300C Crysler", "PT Crysler", "Nossa Gigante", "Black"];

  const filteredImages = images.filter(img => {
    const matchesCategory = activeCategory === "Todos" || img.category === activeCategory;
    const matchesLimo = activeLimo === "Todas" || img.limo === activeLimo;
    return matchesCategory && matchesLimo;
  });

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <section className="pt-32 pb-12 gradient-purple">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Galeria de <span className="gradient-text">Fotos</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Veja nossos veículos de luxo e momentos especiais capturados em diversos eventos
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="flex flex-wrap justify-center gap-2 bg-black/50 rounded-lg p-2 w-full max-w-[95vw] sm:max-w-none">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    if (category === "Kids") {
                      setActiveLimo("Todas");
                    }
                  }}
                  className={`px-3 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                    activeCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {activeCategory !== "Kids" && (
              <div className="flex flex-wrap justify-center gap-2 bg-black/50 rounded-lg p-2 w-full max-w-[95vw] sm:max-w-none">
                {limoTypes.map((limo) => (
                  <button
                    key={limo}
                    onClick={() => setActiveLimo(limo)}
                    className={`px-3 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                      activeLimo === limo
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {limo}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium">{image.alt}</span>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded text-xs">
                    {image.category}
                  </span>
                  {image.category !== "Kids" && image.limo && (
                    <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs">
                      {image.limo}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Imagem ampliada"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Galeria;
