import womenImg from "../assets/banner-01.jpg";
import menImg from "../assets/banner-02.jpg";
import asses from "../assets/banner-03.jpg";


export default function CategoryShowcase() {
    const categories = [
      {
        title: "Women",
        subtitle: "Spring 2018",
        image: womenImg, 
      },
      {
        title: "Men",
        subtitle: "Spring 2018",
        image:menImg,
      },
      {
        title: "Accessories",
        subtitle: "New Trend",
        image: asses,
      },
    ];
  
    return (
      <section className="py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.title} className="relative group overflow-hidden rounded shadow-lg">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white">
                <h3 className="text-2xl font-bold">{cat.title}</h3>
                <p className="text-sm">{cat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  