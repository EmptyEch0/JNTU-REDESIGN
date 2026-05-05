import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/other-amenities/guest-house")({
  component: GuestHousePage,
});

function GuestHousePage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="max-w-4xl mx-auto px-4 py-10 space-y-6 text-sm text-gray-800">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Guest Accommodation</h2>
          <p className="leading-relaxed text-justify">
            The campus guest house welcomes visiting faculty, examiners, and official guests with comfortable lodging and convenient access to campus facilities.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-ink">Guest House Amenities</h3>
          <ul className="mt-3 list-disc list-inside space-y-2 text-muted-foreground">
            <li>Comfortable rooms with furnished interiors</li>
            <li>Room service and guest support</li>
            <li>Nearby dining and campus access</li>
            <li>Friendly hospitality for academic visitors</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-ink">Who Can Stay</h3>
          <p className="leading-relaxed text-justify">
            Visiting dignitaries, guest lecturers, researchers, and parents on official campus business are welcome to stay here during their visit.
          </p>
        </div>
      </section>
    </div>
  );
}
