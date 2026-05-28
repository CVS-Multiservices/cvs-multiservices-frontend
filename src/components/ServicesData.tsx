import {
  Droplets,
  Mountain,
  Trash2,
  Wrench,
  ShieldCheck,
  Truck,
  Factory,
  Waves,
  Settings,
  Gauge,
  HardHat,
  FlaskConical,
  Recycle,
  Users,
  ClipboardList,
} from 'lucide-react';

export const allServices = [
  {
    id: 1,
    index: 0,
    title: 'Mobile Effluent Treatment Plant',
    shortDesc: 'Portable and efficient water treatment solutions for industrial and oilfield sites.',
    img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=500&fit=crop',
    icon: Droplets,
    color: '#d4a017',
    subServices: [
      {
        id: 'metp-1',
        title: 'Produced Water Treatment',
        icon: Waves,
        shortDesc: 'Treatment of produced water generated from oil and gas extraction processes.',
        fullDesc:
          'Our Produced Water Treatment service ensures effective separation, purification, and treatment of water generated during oil and gas production. We deploy advanced mobile treatment systems designed for rapid setup and efficient operation in remote and challenging environments.',
        features: [
          'Oil-water separation systems',
          'Chemical dosing and neutralization',
          'Filtration and polishing units',
          'Portable and rapid deployment',
          'Compliance with discharge norms',
        ],
      },
      {
        id: 'metp-2',
        title: 'Industrial Wastewater Treatment',
        icon: FlaskConical,
        shortDesc: 'Treatment solutions for industrial wastewater from plants and processing facilities.',
        fullDesc:
          'We provide end-to-end industrial wastewater treatment services tailored for manufacturing units, processing plants, and refineries. Our systems are designed to remove contaminants, reduce COD/BOD, and meet environmental discharge standards.',
        features: [
          'Customized treatment systems',
          'COD / BOD reduction',
          'Sludge handling',
          'On-site monitoring support',
          'Regulatory compliance',
        ],
      },
      {
        id: 'metp-3',
        title: 'Operation & Maintenance',
        icon: Settings,
        shortDesc: 'Full O&M support for treatment plant systems and utilities.',
        fullDesc:
          'Our trained teams provide complete operation and maintenance support for mobile and fixed effluent treatment systems. We ensure uninterrupted plant performance, preventive maintenance, and compliance reporting.',
        features: [
          '24/7 operator support',
          'Preventive maintenance',
          'Consumables management',
          'Performance optimization',
          'Reporting and documentation',
        ],
      },
    ],
  },
  {
    id: 2,
    index: 1,
    title: 'Seismic Survey Services',
    shortDesc: 'Comprehensive 2D and 3D seismic survey capabilities with advanced geophysical tools.',
    img: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=800&h=500&fit=crop',
    icon: Mountain,
    color: '#1a5fb4',
    subServices: [
      {
        id: 'seismic-1',
        title: '2D Seismic Survey',
        icon: Mountain,
        shortDesc: 'Efficient 2D data acquisition for exploration and subsurface mapping.',
        fullDesc:
          'Our 2D seismic survey services help clients identify subsurface geological structures with precision. We deploy modern equipment and experienced crews for fast, accurate, and safe field operations.',
        features: [
          'Line planning and acquisition',
          'Data recording systems',
          'Terrain-specific deployment',
          'Accurate subsurface profiling',
          'Field QC and processing support',
        ],
      },
      {
        id: 'seismic-2',
        title: '3D Seismic Survey',
        icon: Gauge,
        shortDesc: 'High-resolution 3D seismic acquisition for advanced reservoir analysis.',
        fullDesc:
          'Our 3D seismic survey solutions deliver high-density geophysical data for detailed reservoir imaging and exploration planning. We support large-scale campaigns with end-to-end field execution.',
        features: [
          'High-density coverage',
          'Reservoir imaging support',
          'Advanced acquisition techniques',
          'Quality controlled deployment',
          'Project planning and supervision',
        ],
      },
      {
        id: 'seismic-3',
        title: 'Survey Manpower & Logistics',
        icon: Users,
        shortDesc: 'Skilled manpower and logistics support for seismic survey operations.',
        fullDesc:
          'We supply experienced field staff, supervisors, equipment operators, and complete logistics support for seismic survey campaigns. Our manpower solutions ensure smooth and efficient project execution.',
        features: [
          'Experienced field crews',
          'Camp logistics support',
          'Vehicle and transport coordination',
          'Site support personnel',
          'Operational supervision',
        ],
      },
    ],
  },
  {
    id: 3,
    index: 2,
    title: 'Waste Management Services',
    shortDesc: 'Compliant waste collection, transport, treatment, and disposal solutions.',
    img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=500&fit=crop',
    icon: Trash2,
    color: '#25d366',
    subServices: [
      {
        id: 'waste-1',
        title: 'Hazardous Waste Handling',
        icon: ShieldCheck,
        shortDesc: 'Safe handling, storage, and disposal of hazardous materials.',
        fullDesc:
          'We manage hazardous waste according to statutory regulations and best practices. Our systems cover segregation, packaging, transportation, and disposal with complete documentation and traceability.',
        features: [
          'Hazardous waste segregation',
          'Safe packaging and transport',
          'Authorized disposal channels',
          'Documentation and manifests',
          'Regulatory compliance',
        ],
      },
      {
        id: 'waste-2',
        title: 'Non-Hazardous Waste Management',
        icon: Recycle,
        shortDesc: 'Collection, processing, and disposal of non-hazardous waste streams.',
        fullDesc:
          'Our non-hazardous waste management services help industries maintain clean and compliant sites through collection, transport, recycling coordination, and responsible disposal.',
        features: [
          'Site collection and segregation',
          'Transport coordination',
          'Recycling support',
          'Disposal planning',
          'Waste volume optimization',
        ],
      },
      {
        id: 'waste-3',
        title: 'Waste Transportation',
        icon: Truck,
        shortDesc: 'Secure and compliant transportation of industrial waste materials.',
        fullDesc:
          'We provide specialized transportation support for waste materials using compliant vehicles, tracking mechanisms, and trained personnel to ensure safe transfer from site to treatment or disposal facilities.',
        features: [
          'Specialized vehicle fleet',
          'Driver and route compliance',
          'Waste transfer documentation',
          'Safe loading/unloading',
          'Timely delivery to facilities',
        ],
      },
    ],
  },
  {
    id: 4,
    index: 3,
    title: 'Equipment Rental & Supply',
    shortDesc: 'Industrial equipment, machinery, and support systems for project operations.',
    img: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=500&fit=crop',
    icon: Wrench,
    color: '#f97316',
    subServices: [
      {
        id: 'equip-1',
        title: 'Heavy Equipment Rental',
        icon: Factory,
        shortDesc: 'Rental solutions for industrial and field equipment.',
        fullDesc:
          'We provide a range of heavy industrial equipment for short-term and long-term rental across oilfield, industrial, and infrastructure projects. All equipment is maintained for high reliability and performance.',
        features: [
          'Short and long-term rental',
          'Well-maintained equipment',
          'Operator support available',
          'Flexible deployment',
          'Technical assistance',
        ],
      },
      {
        id: 'equip-2',
        title: 'Safety Equipment Supply',
        icon: HardHat,
        shortDesc: 'Supply of PPE and industrial safety materials.',
        fullDesc:
          'We supply certified personal protective equipment and industrial safety materials for field teams, plant workers, and contractors. Our products help maintain workplace safety and compliance.',
        features: [
          'PPE kits',
          'Industrial safety materials',
          'Certified products',
          'Bulk supply capability',
          'Timely delivery',
        ],
      },
      {
        id: 'equip-3',
        title: 'Maintenance Tools & Consumables',
        icon: ClipboardList,
        shortDesc: 'Tools, spares, and consumables for project and plant maintenance.',
        fullDesc:
          'From maintenance tools to operational consumables, we support clients with the supplies needed to maintain efficiency and reduce downtime during industrial operations.',
        features: [
          'Plant maintenance tools',
          'Operational consumables',
          'Fast procurement support',
          'Spare part sourcing',
          'Inventory assistance',
        ],
      },
    ],
  },
];