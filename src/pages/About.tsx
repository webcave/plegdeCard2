import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Empowering Communities Across Uganda
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Building bridges of hope through transparent, community-driven fundraising
            </p>
          </section>

          {/* Mission Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              At Pledge Card Uganda, we believe in the power of collective action to transform lives. 
              Our platform connects passionate individuals with meaningful causes, creating a ripple effect 
              of positive change across Uganda. Through transparent fundraising and community engagement, 
              we're building a brighter future for all Ugandans.
            </p>
          </section>

          {/* Values Section */}
          <section className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in complete transparency in all our operations. Every shilling donated is tracked 
                and its impact clearly documented, ensuring your contributions make a real difference.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Community-Driven</h3>
              <p className="text-muted-foreground">
                Our platform is built by and for Ugandans. We understand local needs and challenges, 
                ensuring that every campaign creates meaningful impact where it's needed most.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Innovation</h3>
              <p className="text-muted-foreground">
                We leverage technology to make giving easier and more impactful. Our digital platform 
                connects donors directly with causes, eliminating barriers and maximizing impact.
              </p>
            </div>
          </section>

          {/* Impact Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Our Impact</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="p-6 bg-card rounded-lg text-center">
                <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                <div className="text-sm text-muted-foreground">Campaigns Funded</div>
              </div>
              <div className="p-6 bg-card rounded-lg text-center">
                <div className="text-3xl font-bold text-primary mb-2">UGX 500M+</div>
                <div className="text-sm text-muted-foreground">Total Contributions</div>
              </div>
              <div className="p-6 bg-card rounded-lg text-center">
                <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
                <div className="text-sm text-muted-foreground">Lives Impacted</div>
              </div>
            </div>
          </section>

          {/* Focus Areas Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Our Focus Areas</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Education</h3>
                <p className="text-muted-foreground">
                  Supporting students, schools, and educational initiatives to build a stronger foundation 
                  for Uganda's future generations.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Healthcare</h3>
                <p className="text-muted-foreground">
                  Improving access to quality healthcare services and supporting medical facilities across 
                  both urban and rural communities.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Agriculture</h3>
                <p className="text-muted-foreground">
                  Empowering farmers and agricultural initiatives to enhance food security and sustainable 
                  farming practices.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Community Development</h3>
                <p className="text-muted-foreground">
                  Supporting local infrastructure projects and community initiatives that improve quality 
                  of life for all Ugandans.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center space-y-6 py-8">
            <h2 className="text-3xl font-bold">Join Us in Making a Difference</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're looking to start a campaign or contribute to an existing cause, 
              your participation makes our community stronger.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/campaigns">
                <Button size="lg">View Campaigns</Button>
              </Link>
              <Link to="/campaigns/create">
                <Button variant="outline" size="lg">Start a Campaign</Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
