const serviceTiers = [
  {
    name: "One-Time Generation",
    price: "$100",
    description: "Complete content generation package.",
    deliverables: [
      "Text content",
      "Audio content",
      "Visual assets",
      "Conversation scripts"
    ]
  },
  {
    name: "Monthly Retainer",
    price: "Custom",
    description: "Ongoing management and engagement.",
    deliverables: [
      "Content posting and scheduling",
      "Community engagement and growth",
      "Performance optimization",
      "Detailed analytics and reporting"
    ]
  }
];

export function ServiceTiers() {
  return (
    <div className="service-tiers">
      {serviceTiers.map((tier, index) => (
        <div key={index} className="tier-card">
          <h3 className="tier-name">{tier.name}</h3>
          <p className="tier-price">{tier.price}</p>
          <p className="tier-description">{tier.description}</p>
          <ul className="tier-deliverables">
            {tier.deliverables.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
} 