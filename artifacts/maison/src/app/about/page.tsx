import Link from "next/link"
import { AppLayout } from "@/components/layout/AppLayout"

export default function AboutPage() {
  return (
    <AppLayout>
      <div className="bg-cream">

      <section className="relative h-[70vh] bg-ink flex 
                          items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t 
                        from-ink/80 to-transparent z-10"/>
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4
          }}
        />
        <div className="relative z-20 max-w-6xl mx-auto 
                        px-6 pb-20 w-full">
          <p className="font-mono text-xs tracking-widest 
                        text-gold uppercase mb-4">
            Est. 2020 · New Delhi, India
          </p>
          <h1 className="font-cormorant text-6xl md:text-8xl 
                         font-light text-white leading-none">
            Crafted with<br/>
            <em className="text-gold">Intention</em>
          </h1>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 
                        gap-16 items-center">
          <div>
            <p className="font-mono text-xs tracking-widest 
                          text-gold uppercase mb-6">
              Our Story
            </p>
            <h2 className="font-cormorant text-4xl font-light 
                           mb-8 leading-tight">
              Born from a belief that luxury is not excess — 
              it is precision.
            </h2>
            <div className="space-y-4 text-muted font-light 
                            leading-relaxed text-sm">
              <p>
                MAISON was founded in 2020 in New Delhi with a 
                singular vision: to create fashion that speaks 
                through restraint. In a world of excess, we 
                chose silence — clean lines, deliberate cuts, 
                and materials chosen for their soul.
              </p>
              <p>
                Every piece in our collection begins with a 
                question: does this need to exist? Only when 
                the answer is a resounding yes do our designers 
                begin the long, obsessive process of bringing 
                it to life.
              </p>
              <p>
                We believe the most powerful statement a person 
                can make is one of quiet confidence. Our clothes, 
                handbags, and accessories are made for those who 
                understand this.
              </p>
            </div>
          </div>
          <div className="aspect-[4/5] overflow-hidden bg-cream-2">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
              alt="MAISON Story"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="bg-ink py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-mono text-xs tracking-widest 
                          text-gold uppercase mb-4">
              What We Stand For
            </p>
            <h2 className="font-cormorant text-4xl font-light 
                           text-white">
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Intentional Design",
                description: "Every stitch, seam, and silhouette is deliberate. We remove until nothing is left to remove — only then is a piece ready."
              },
              {
                number: "02", 
                title: "Ethical Craftsmanship",
                description: "We partner with artisan workshops across India who share our commitment to fair wages, safe conditions, and traditional craft."
              },
              {
                number: "03",
                title: "Sustainable Luxury",
                description: "We use natural, sustainable fabrics — organic cotton, linen, silk, and ethically sourced leather. Luxury that doesn't cost the earth."
              },
              {
                number: "04",
                title: "Timeless Over Trendy",
                description: "We don't follow seasons. We create pieces designed to last a decade, not a month. Buy less, choose well."
              },
              {
                number: "05",
                title: "Inclusive Sizing",
                description: "MAISON is made for every body. Our collections range from XS to 3XL with the same attention to fit and finish."
              },
              {
                number: "06",
                title: "Transparent Pricing",
                description: "We price honestly. No inflated markups, no false sales. Every rupee reflects the true cost of quality."
              },
            ].map((value) => (
              <div 
                key={value.number}
                className="border border-white/10 p-8 
                           hover:border-gold transition-colors"
              >
                <p className="font-cormorant text-5xl font-light 
                               text-gold/30 mb-4">
                  {value.number}
                </p>
                <h3 className="font-cormorant text-xl font-light 
                               text-white mb-3">
                  {value.title}
                </h3>
                <p className="font-light text-sm text-white/50 
                               leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-widest 
                        text-gold uppercase mb-4">
            How We Work
          </p>
          <h2 className="font-cormorant text-4xl font-light">
            From Concept to Closet
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "1",
              title: "Design",
              desc: "Our designers sketch by hand. Every collection starts with paper, not a screen."
            },
            {
              step: "2", 
              title: "Material",
              desc: "We source sustainable fabrics from certified mills across India and Europe."
            },
            {
              step: "3",
              title: "Craft",
              desc: "Skilled artisans bring each piece to life in our partner workshops in Delhi and Jaipur."
            },
            {
              step: "4",
              title: "Quality Check",
              desc: "Every single piece passes a 47-point quality inspection before it reaches you."
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 border border-site-border 
                              rounded-full flex items-center 
                              justify-center mx-auto mb-6">
                <span className="font-cormorant text-2xl 
                                 font-light text-gold">
                  {item.step}
                </span>
              </div>
              <h3 className="font-cormorant text-xl font-light mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-muted font-light 
                             leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-cream-2 border-y border-site-border py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "2020", label: "Year Founded" },
              { number: "12,000+", label: "Happy Customers" },
              { number: "340+", label: "Curated Pieces" },
              { number: "18", label: "Countries Shipped" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-cormorant text-5xl font-light 
                               text-ink mb-2">
                  {stat.number}
                </p>
                <p className="font-mono text-xs tracking-widest 
                               text-muted uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="font-mono text-xs tracking-widest 
                        text-gold uppercase mb-4">
            The People
          </p>
          <h2 className="font-cormorant text-4xl font-light">
            Meet Our Team
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Arjun Mehta",
              role: "Founder & Creative Director",
              image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
              bio: "Former fashion editor turned founder. Arjun spent 10 years at Vogue India before launching MAISON with a vision for quiet luxury."
            },
            {
              name: "Priya Sharma",
              role: "Head of Design",
              image: "https://images.unsplash.com/photo-1494790108755-2616b8ddf500?w=400",
              bio: "Trained at NID Ahmedabad, Priya brings an architect's precision to fashion. She believes clothes should be as structural as they are beautiful."
            },
            {
              name: "Rohit Kapoor",
              role: "Head of Sustainability",
              image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
              bio: "Rohit ensures every decision at MAISON considers its impact on people and planet. He oversees our supply chain from seed to store."
            },
          ].map((member) => (
            <div key={member.name}>
              <div className="aspect-square overflow-hidden 
                              bg-cream-2 mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover 
                             hover:scale-105 transition-transform 
                             duration-500"
                />
              </div>
              <p className="font-mono text-xs tracking-widest 
                             text-gold uppercase mb-1">
                {member.role}
              </p>
              <h3 className="font-cormorant text-2xl font-light mb-3">
                {member.name}
              </h3>
              <p className="text-sm text-muted font-light 
                             leading-relaxed">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SUSTAINABILITY SECTION */}
      <section className="bg-ink py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 
                          gap-16 items-center">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
                alt="Sustainability"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            <div>
              <p className="font-mono text-xs tracking-widest 
                            text-gold uppercase mb-6">
                Our Commitment
              </p>
              <h2 className="font-cormorant text-4xl font-light 
                             text-white mb-8">
                Fashion that doesn't cost the earth
              </h2>
              <div className="space-y-4">
                {[
                  "100% natural and sustainable fabrics",
                  "Carbon neutral shipping by 2025",
                  "Zero plastic packaging",
                  "Fair wages for all artisan partners",
                  "1% of revenue to environmental causes",
                  "Take-back program for old MAISON pieces",
                ].map((item) => (
                  <div key={item} 
                       className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-gold 
                                    rounded-full flex-shrink-0"/>
                    <p className="text-sm text-white/70 font-light">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <p className="font-mono text-xs tracking-widest 
                        text-gold uppercase mb-6">
            Ready to explore?
          </p>
          <h2 className="font-cormorant text-5xl font-light 
                         mb-8 leading-tight">
            Discover the Collection
          </h2>
          <p className="text-muted text-sm font-light 
                         leading-relaxed mb-10">
            Every piece tells a story. Find yours in our 
            curated collection of clothes, handbags, 
            and accessories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-ink text-white font-mono text-xs 
                         tracking-widest uppercase px-10 py-4
                         hover:bg-gray-800 transition-colors"
            >
              SHOP NOW
            </Link>
            <Link
              href="/contact"
              className="border border-site-border text-ink 
                         font-mono text-xs tracking-widest 
                         uppercase px-10 py-4 hover:border-ink
                         transition-colors"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </section>

    </div>
    </AppLayout>
  )
}
