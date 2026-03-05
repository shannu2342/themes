import { ArrowUpRight, Sparkles, Image, Wand2, Layers } from "lucide-react";
import heroCollage from "@/assets/hero-themes-collage.jpg";

const features = [
  { icon: Sparkles, label: "AI Generation" },
  { icon: Image, label: "Stock Photos" },
  { icon: Wand2, label: "Image Editing" },
  { icon: Layers, label: "Templates" },
];

const AIToolsSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="text-primary text-3xl font-bold flex items-center gap-2">
              ⚡ themevault
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Create with AI tools & unlimited stock assets.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Get unlimited downloads of{" "}
              <span className="text-primary font-medium">Web Templates</span>,{" "}
              <span className="text-primary font-medium">Stock Video</span> and millions of creative
              stock assets. Plus access our AI tools —{" "}
              <span className="font-semibold">ImageGen</span>,{" "}
              <span className="font-semibold">ImageEdit</span> and more.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-3 pt-2">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary flex items-center gap-2 mt-4">
              Start now
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <p className="text-sm text-muted-foreground">
              Cancel anytime. <span className="font-medium">7-day free trial</span> available.
            </p>
          </div>

          {/* Right Content - Preview Grid */}
          <div className="relative">
            <img
              src={heroCollage}
              alt="Collection of templates and AI tools"
              className="rounded-lg shadow-2xl w-full"
            />
            <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg">
              <span className="font-bold">$16.50/mo</span>
              <span className="text-sm opacity-90 ml-2">billed annually</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIToolsSection;
