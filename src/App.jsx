import { SafeIcon } from './components/SafeIcon';
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// Clean Map Component
const CleanMap = ({ coordinates = [24.8468, 48.3134], zoom = 10 }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return

    const styleUrl = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: coordinates,
      zoom: zoom,
      attributionControl: false,
      interactive: true,
      dragPan: true,
      dragRotate: false,
      touchZoomRotate: false,
      doubleClickZoom: true,
      keyboard: false
    })

    map.current.scrollZoom.disable()

    // Add markers for Kosiv and Verkhovyna
    const markers = [
      { lng: 25.0956, lat: 48.3156, title: 'Косівський район' },
      { lng: 24.6981, lat: 48.1531, title: 'Верховинський район' }
    ]

    markers.forEach(marker => {
      const el = document.createElement('div')
      el.className = 'custom-map-marker'

      new maplibregl.Marker({ element: el })
        .setLngLat([marker.lng, marker.lat])
        .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<strong style="color: #8B4513;">${marker.title}</strong>`))
        .addTo(map.current)
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [coordinates, zoom])

  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-800 relative">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  )
}

// Animated Section Component
const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Plot Card Component
const PlotCard = ({ size, price, features, image }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="wood-card rounded-2xl overflow-hidden"
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={image}
        alt={`Участок ${size} соток`}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-4 right-4 bg-amber-800 text-amber-100 px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
        {price}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-2xl font-bold text-amber-900 mb-2 font-serif">{size}</h3>
      <p className="text-amber-700 mb-4 font-medium">Під будівництво з перспективою комунікацій</p>
      <ul className="space-y-2">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-amber-800">
            <SafeIcon name="check-circle-2" size={18} className="text-green-600 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <button className="w-full mt-6 wood-button text-amber-100 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
        Детальніше
        <SafeIcon name="chevron-right" size={18} />
      </button>
    </div>
  </motion.div>
)

// Advantage Card Component
const AdvantageCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border-2 border-amber-200 shadow-lg"
  >
    <div className="bg-amber-800 w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-md">
      <SafeIcon name={icon} size={32} className="text-amber-100" />
    </div>
    <h3 className="text-xl font-bold text-amber-900 mb-3 font-serif">{title}</h3>
    <p className="text-amber-800 leading-relaxed">{description}</p>
  </motion.div>
)

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const plots = [
    {
      size: '20 соток',
      price: '$15,000',
      features: ['Гірський пейзаж', 'Грунтова дорога', 'Електрика поруч'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'
    },
    {
      size: '40 соток',
      price: '$28,000',
      features: ['Панорамний вид', 'Річка поруч', 'Лісова зона', 'Місце для котеджу'],
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80'
    },
    {
      size: '60 соток',
      price: '$42,000',
      features: ['Ідеально для котеджу', 'Електрика поруч', 'Огороджена територія'],
      image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80'
    },
    {
      size: '80 соток',
      price: '$55,000',
      features: ['VIP локація', 'Приватна грунтова дорога', 'Власне джерело', 'Повний пакет документів'],
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80'
    }
  ]

  const advantages = [
    {
      icon: 'wind',
      title: 'Екологічна чистота',
      description: 'Найчистіше повітря в Україні, віддаленість від промислових зон, багата флора та фауна Карпат.'
    },
    {
      icon: 'snowflake',
      title: 'Гірськолижні курорти',
      description: 'Близькість до Буковелю (45 км), Верховини та інших зимових курортів. Ідеально для бізнесу та відпочинку.'
    },
    {
      icon: 'road',
      title: 'Природні шляхи',
      description: 'Грунтові дороги, які зберігають первісну красу природи. Тихий спокій без шуму асфальту та міста.'
    },
    {
      icon: 'tree-pine',
      title: 'Неповторна природа',
      description: 'Гори, ліси, річки та водоспади. Мальовничі краєвиди, які надихають та дарують спокій.'
    },
    {
      icon: 'zap',
      title: 'Електропостачання',
      description: 'Лінії електропередач вздовж ділянок. Потужність до 15 кВт. Автономне опалення та альтернативні джерела енергії.'
    },
    {
      icon: 'trending-up',
      title: 'Інвестиційний потенціал',
      description: 'Зростання вартості землі 15-20% щорічно. Перспектива підведення комунікацій у майбутньому.'
    }
  ]

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 via-amber-50 to-stone-200 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-amber-900/95 backdrop-blur-md z-50 border-b-4 border-amber-700 shadow-lg">
        <nav className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-lg">
                <SafeIcon name="mountain" size={28} className="text-amber-800" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-amber-100 font-serif">Карпатський край</h1>
                <p className="text-xs md:text-sm text-amber-200">Земельні ділянки в Косові та Верховині</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('plots')} className="text-amber-100 hover:text-white transition-colors font-medium">Ділянки</button>
              <button onClick={() => scrollToSection('advantages')} className="text-amber-100 hover:text-white transition-colors font-medium">Переваги</button>
              <button onClick={() => scrollToSection('construction')} className="text-amber-100 hover:text-white transition-colors font-medium">Будівництво</button>
              <button onClick={() => scrollToSection('location')} className="text-amber-100 hover:text-white transition-colors font-medium">Локація</button>
              <button onClick={() => scrollToSection('contacts')} className="bg-amber-100 text-amber-900 px-6 py-2 rounded-lg font-bold hover:bg-white transition-all">
                Контакти
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden bg-amber-800 p-2 rounded-lg text-amber-100"
            >
              {isMenuOpen ? <SafeIcon name="x" size={24} /> : <SafeIcon name="menu" size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="md:hidden mt-4 pb-4 border-t border-amber-800 pt-4 space-y-3"
            >
              <button onClick={() => scrollToSection('plots')} className="block w-full text-left text-amber-100 py-2">Ділянки</button>
              <button onClick={() => scrollToSection('advantages')} className="block w-full text-left text-amber-100 py-2">Переваги</button>
              <button onClick={() => scrollToSection('construction')} className="block w-full text-left text-amber-100 py-2">Будівництво</button>
              <button onClick={() => scrollToSection('location')} className="block w-full text-left text-amber-100 py-2">Локація</button>
              <button onClick={() => scrollToSection('contacts')} className="block w-full text-left text-amber-100 py-2">Контакти</button>
            </motion.div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_1112963888/edit-photo-1771257188-6811.jpg?"
            alt="Карпатські гори"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/70 via-amber-900/50 to-stone-900/80" />
        </div>

        <div className="relative z-10 container mx-auto px-4 md:px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 bg-amber-100/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-amber-200/30">
              <SafeIcon name="map-pin" size={18} className="text-amber-300" />
              <span className="text-amber-100 text-sm md:text-base">Косівський та Верховинський райони</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 font-serif leading-tight">
              Ваша земля в серці <span className="text-amber-400">Карпат</span>
            </h1>

            <p className="text-lg md:text-2xl text-amber-100 mb-8 leading-relaxed max-w-2xl">
              Земельні ділянки від 20 до 80 соток з перспективою будівництва.
              Екологічна чистота, гірські пейзажі та первісна природа без асфальту.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('plots')}
                className="wood-button text-amber-100 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                Обрати ділянку
                <SafeIcon name="chevron-right" size={20} />
              </button>
              <button
                onClick={() => scrollToSection('contacts')}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border-2 border-white/30"
              >
                Зв'язатися
              </button>
            </div>

            <div className="flex flex-wrap gap-6 mt-12">
              <div className="flex items-center gap-2 text-amber-200">
                <SafeIcon name="check-circle-2" size={20} />
                <span className="text-sm md:text-base">Перевірені ділянки</span>
              </div>
              <div className="flex items-center gap-2 text-amber-200">
                <SafeIcon name="check-circle-2" size={20} />
                <span className="text-sm md:text-base">Повний пакет документів</span>
              </div>
              <div className="flex items-center gap-2 text-amber-200">
                <SafeIcon name="check-circle-2" size={20} />
                <span className="text-sm md:text-base">Розстрочка 0%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Notice Section */}
      <section className="py-8 px-4 md:px-6 bg-red-50 border-y-2 border-red-200">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-md border border-red-100">
            <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
              <SafeIcon name="alert-circle" size={28} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-2">Важлива інформація</h3>
              <p className="text-red-800 leading-relaxed">
                На даний момент до ділянок <strong>відсутні магістральний газ та асфальтовані дороги</strong>.
                Ділянки мають грунтовий під'їзд. Підведення комунікацій планується у 2026-2027 роках.
                Рекомендуємо використовувати автономні системи опалення (газгольдери, твердопаливні котли,
                електроопалення) та підготувати транспорт для грунтових доріг.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Plots Section */}
      <section id="plots" className="py-20 md:py-32 px-4 md:px-6">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-amber-900 mb-4 font-serif">
                Доступні ділянки
              </h2>
              <p className="text-lg md:text-xl text-amber-800 max-w-3xl mx-auto">
                Участки під будівництво від 20 до 80 соток у наймальовничіших куточках Карпат.
                Перспектива підведення комунікацій у майбутньому.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plots.map((plot, index) => (
              <AnimatedSection key={index}>
                <PlotCard {...plot} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section id="advantages" className="py-20 md:py-32 px-4 md:px-6 bg-gradient-to-b from-stone-100 to-amber-100">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-amber-900 mb-4 font-serif">
                Переваги регіону
              </h2>
              <p className="text-lg md:text-xl text-amber-800">
                Косівський та Верховинський райони — серце Гуцульщини
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage, index) => (
              <AnimatedSection key={index}>
                <AdvantageCard {...advantage} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Construction Perspective Section */}
      <section id="construction" className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900 to-amber-800" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-5xl font-black text-amber-100 mb-6 font-serif">
                Перспектива будівництва
              </h2>
              <p className="text-lg text-amber-200 mb-8 leading-relaxed">
                Всі ділянки мають статус земель житлової та громадської забудови.
                Перспектива підведення комунікацій запланована на 2026-2027 роки.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg flex-shrink-0">
                    <SafeIcon name="zap" size={24} className="text-amber-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-100 mb-2">Електропостачання</h3>
                    <p className="text-amber-200">Лінії електропередач вздовж всіх ділянок. Потужність до 15 кВт на ділянку.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg flex-shrink-0">
                    <SafeIcon name="droplets" size={24} className="text-amber-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-100 mb-2">Водопостачання</h3>
                    <p className="text-amber-200">Можливість свердловин (60-80 метрів) або колодязів. Чиста гірська вода.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg flex-shrink-0">
                    <SafeIcon name="home" size={24} className="text-amber-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-100 mb-2">Автономне опалення</h3>
                    <p className="text-amber-200">На даний момент газ відсутній. Рекомендуємо газгольдери, теплові помпи або твердопаливні котли. Планове підведення газу до 2027 року.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-amber-100 p-3 rounded-lg flex-shrink-0">
                    <SafeIcon name="road" size={24} className="text-amber-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-100 mb-2">Дороги</h3>
                    <p className="text-amber-200">Наразі грунтові під'їзди. Асфальт планується у 2026-2027 роках. Рекомендується автомобіль з підвищеною прохідністю.</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_1112963888/edit-photo-1771257188-6811.jpg?"
                  alt="Карпатський пейзаж - ділянка"
                  className="rounded-2xl shadow-2xl w-full h-48 md:h-64 object-cover"
                />
                <img
                  src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_1112963888/edit-photo-1771257189-6203.jpg?"
                  alt="Лісова стежка"
                  className="rounded-2xl shadow-2xl w-full h-48 md:h-64 object-cover mt-8"
                />
                <img
                  src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_1112963888/edit-photo-1771257189-4830.jpg?"
                  alt="Лісова поляна"
                  className="rounded-2xl shadow-2xl w-full h-48 md:h-64 object-cover"
                />
                <img
                  src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_1112963888/edit-photo-1771257188-6811.jpg?"
                  alt="Карпатський краєвид"
                  className="rounded-2xl shadow-2xl w-full h-48 md:h-64 object-cover mt-8"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="location" className="py-20 md:py-32 px-4 md:px-6 bg-gradient-to-b from-amber-100 to-stone-100">
        <div className="container mx-auto max-w-7xl">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-amber-900 mb-4 font-serif">
                Розташування
              </h2>
              <p className="text-lg md:text-xl text-amber-800">
                Косівський та Верховинський райони Івано-Франківської області
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <CleanMap coordinates={[24.9, 48.23]} zoom={9} />
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-amber-200 text-center">
                <SafeIcon name="map-pin" size={32} className="text-amber-700 mx-auto mb-3" />
                <h3 className="font-bold text-amber-900 mb-1">До Буковелю</h3>
                <p className="text-amber-700">45 км (45 хв)</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-amber-200 text-center">
                <SafeIcon name="map-pin" size={32} className="text-amber-700 mx-auto mb-3" />
                <h3 className="font-bold text-amber-900 mb-1">До Івано-Франківська</h3>
                <p className="text-amber-700">95 км (1.5 год)</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-amber-200 text-center">
                <SafeIcon name="map-pin" size={32} className="text-amber-700 mx-auto mb-3" />
                <h3 className="font-bold text-amber-900 mb-1">До Львова</h3>
                <p className="text-amber-700">180 км (2.5 год)</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className="py-20 md:py-32 px-4 md:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-100 to-amber-50" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-black text-amber-900 mb-4 font-serif">
                Зв'яжіться з нами
              </h2>
              <p className="text-lg md:text-xl text-amber-800">
                Отримайте консультацію та організуйте огляд ділянок
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="wood-card p-8 md:p-12 rounded-3xl">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <a
                  href="tel:+380501234567"
                  className="flex items-center gap-4 bg-amber-800 hover:bg-amber-700 text-amber-100 p-6 rounded-xl transition-all transform hover:scale-105"
                >
                  <div className="bg-amber-100 p-3 rounded-full">
                    <SafeIcon name="phone" size={28} className="text-amber-800" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Телефон</p>
                    <p className="text-xl font-bold">+38 (050) 123-45-67</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/380501234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-green-700 hover:bg-green-600 text-white p-6 rounded-xl transition-all transform hover:scale-105"
                >
                  <div className="bg-white p-3 rounded-full">
                    <SafeIcon name="message-circle" size={28} className="text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">WhatsApp</p>
                    <p className="text-xl font-bold">Написати</p>
                  </div>
                </a>
              </div>

              <div className="text-center">
                <p className="text-amber-800 mb-4">
                  Працюємо щодня з 9:00 до 20:00
                </p>
                <p className="text-amber-700 text-sm">
                  Організовуємо огляди ділянок у зручний для вас час
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-100 py-12 px-4 md:px-6 telegram-safe-bottom">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <SafeIcon name="mountain" size={24} />
                <span className="text-xl font-bold font-serif">Карпатський край</span>
              </div>
              <p className="text-amber-200 text-sm leading-relaxed">
                Продаж земельних ділянок у Косівському та Верховинському районах.
                Екологічна чистота, гірські краєвиди, перспектива розвитку.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Навігація</h3>
              <ul className="space-y-2 text-amber-200">
                <li><button onClick={() => scrollToSection('plots')} className="hover:text-white transition-colors">Ділянки</button></li>
                <li><button onClick={() => scrollToSection('advantages')} className="hover:text-white transition-colors">Переваги</button></li>
                <li><button onClick={() => scrollToSection('construction')} className="hover:text-white transition-colors">Будівництво</button></li>
                <li><button onClick={() => scrollToSection('location')} className="hover:text-white transition-colors">Локація</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Контакти</h3>
              <ul className="space-y-2 text-amber-200">
                <li className="flex items-center gap-2">
                  <SafeIcon name="phone" size={16} />
                  <span>+38 (050) 123-45-67</span>
                </li>
                <li className="flex items-center gap-2">
                  <SafeIcon name="message-circle" size={16} />
                  <span>WhatsApp</span>
                </li>
                <li className="flex items-center gap-2">
                  <SafeIcon name="map-pin" size={16} />
                  <span>м. Косів, Івано-Франківська обл.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-amber-800 pt-8 text-center text-amber-300 text-sm">
            <p>© 2024 Карпатський край. Всі права захищені.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App