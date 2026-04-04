"use client";
import { AppLayout } from "@/components/layout/AppLayout";

export default function Lookbook() {
  return (
    <AppLayout>
      <div className="w-full pt-32 pb-32">
        <header className="max-w-[800px] mx-auto text-center px-6 mb-24">
          <h1 className="font-display text-5xl md:text-7xl mb-6">SS25 Lookbook</h1>
          <p className="font-sans text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Exploring the space between motion and stillness. A collection defined by raw textures, asymmetrical cuts, and effortless luxury.
          </p>
        </header>

        {/* Editorial Grid */}
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
          
          <div className="md:col-span-8 aspect-[16/9] md:aspect-auto md:h-[800px] overflow-hidden group">
            {/* lookbook editorial high fashion street */}
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" />
          </div>
          
          <div className="md:col-span-4 flex flex-col justify-end space-y-6 md:space-y-12">
            <div className="aspect-[3/4] overflow-hidden group">
              {/* lookbook editorial detail shot minimalist */}
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" />
            </div>
            <div className="p-6 bg-secondary">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-muted-foreground">Look 01</p>
              <p className="font-sans text-sm leading-relaxed">The oversized wool-blend overcoat layered atop fluid silk separates. Monochromatic confidence.</p>
            </div>
          </div>

          <div className="md:col-span-6 aspect-[3/4] md:mt-24 overflow-hidden group">
            {/* lookbook editorial male fashion sharp */}
            <img src="https://pixabay.com/get/g63b8e7a34d3531919f88ada18acec12cc12eab485d5b8ea3a1817ba41b6b3bb1ea9da73d72b9210fc3d83d0053f244613a8ecdc7737212740e64ef47d86c0c14_1280.jpg" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" />
          </div>

          <div className="md:col-span-6 aspect-square md:aspect-[3/4] overflow-hidden group">
             {/* lookbook editorial female minimal art */}
             <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=80" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" />
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
