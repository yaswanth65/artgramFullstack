const ActivitiesPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-600 to-rose-700 text-white text-center py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Creative Activities</h1>
          <p className="text-lg mb-4">Discover hands-on experiences that spark imagination and creativity</p>
          <p className="text-base">
            From slime making to art creation - we have something special for every creative soul
          </p>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold mb-12 text-slate-900">Our Featured Activities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="🌈"
              title="Slime Play"
              desc="Create colorful, stretchy, and sparkly slime in various textures."
              cta="Book Now"
              href="/slime-play.html"
            />
            <FeatureCard
              icon="🎨"
              title="Art Making"
              desc="Express creativity through painting, drawing, and mixed media art."
              cta="Learn More →"
              href="/art-making-activity.html"
      
            />
            <FeatureCard
              icon="🧶"
              title="Tufting Experience"
              desc="Create beautiful rugs and wall hangings using tufting guns."
              cta="Book Now"
              href="/tufting-activity.html"
            />
          </div>
        </div>
      </section>

      {/* All Activities */}
      <section className="py-20 bg-slate-100">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold mb-12 text-slate-900">All Our Activities</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ActivityCard
              icon="🌈"
              age="Ages 4-12"
              title="Slime Play"
              price="₹299"
              desc="Create colorful, stretchy, and sparkly slime in various textures. Kids learn about polymers while having endless fun mixing and creating their perfect slime recipe."
            />
            <ActivityCard
              icon="🎨"
              age="Ages 3-15"
              title="Art Making"
              price="₹399"
              desc="Express creativity through painting, drawing, and mixed media art. Professional guidance helps children explore different techniques and discover their artistic style."
            />
            <ActivityCard
              icon="🧶"
              age="Ages 8+"
              title="Tufting Experience"
              price="₹799"
              desc="Create beautiful rugs and wall hangings using tufting guns. Learn this trending craft technique and take home your unique textile masterpiece."
            />
            <ActivityCard
              icon="💡"
              age="Ages 10+"
              title="Neon Art Creation"
              price="₹599"
              desc="Design and create stunning neon-style artwork using LED strips and acrylic. Perfect for room decoration and learning about color theory and design."
            />
            <ActivityCard
              icon="🏺"
              age="Ages 5-14"
              title="Clay Modeling Workshop"
              price="₹449"
              desc="Shape imagination into reality with clay modeling. Create pottery, sculptures, and decorative items while developing fine motor skills and spatial awareness."
            />
            <ActivityCard
              icon="💻"
              age="Ages 8+"
              title="Digital Art & Design"
              price="₹549"
              desc="Explore digital creativity using tablets and design software. Learn illustration, animation basics, and create digital masterpieces in a tech-savvy environment."
            />
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold mb-12 text-slate-900">Why Choose Our Activities?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <WhyCard
              icon="👨‍🏫"
              title="Expert Instructors"
              desc="Professional artists and educators guide every session with patience and expertise."
            />
            <WhyCard
              icon="🎯"
              title="Age-Appropriate"
              desc="Activities designed specifically for different age groups to ensure optimal learning experience."
            />
            <WhyCard
              icon="🏆"
              title="Take Home Creations"
              desc="Every participant leaves with their unique creation and newfound skills."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

const FeatureCard = ({ icon, title, desc, cta, href, accent }) => {
  return (
    <a
      href={href}
      className="block bg-white rounded-2xl p-10 text-center shadow-[0_5px_20px_rgba(0,0,0,0.1)] transition-all relative overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(225,29,72,0.3)] no-underline"
    >
      <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
        {icon}
      </div>
      <h4 className="text-slate-900 font-bold text-xl mb-3">{title}</h4>
      <p className="text-slate-500 mb-6">{desc}</p>
      <div
        className={`${accent ? "text-rose-600" : "bg-rose-600 text-white px-5 py-2 rounded-full inline-block"} font-semibold`}
      >
        {cta}
      </div>
    </a>
  )
}

const ActivityCard = ({ icon, age, title, price, desc }) => {
  return (
    <div className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all">
      <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
        {icon}
      </div>
      <span className="bg-rose-600 text-white px-4 py-1 rounded-full text-sm font-medium inline-block mb-4">{age}</span>
      <h4 className="text-xl font-bold mb-3 text-slate-900">{title}</h4>
      <p className="text-slate-600 mb-4">{desc}</p>
      <div className="text-rose-600 font-bold text-xl mb-4">{price}</div>
      <button className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 text-white py-3 font-semibold transition-colors">
        Book Now
      </button>
    </div>
  )
}

const WhyCard = ({ icon, title, desc }) => {
  return (
    <div className="text-center p-6">
      <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
        {icon}
      </div>
      <h5 className="text-slate-900 font-semibold mb-2">{title}</h5>
      <p className="text-slate-600">{desc}</p>
    </div>
  )
}

export default ActivitiesPage
