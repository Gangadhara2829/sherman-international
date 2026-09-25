const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Sherman International database with 100% authentic original website data...');

  // 1. Admin User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Sherman@2026!', salt);

  await prisma.adminUser.upsert({
    where: { email: 'admin@sherman-india.com' },
    update: { passwordHash },
    create: {
      email: 'admin@sherman-india.com',
      passwordHash,
      name: 'Sherman Administrator',
      role: 'SUPER_ADMIN',
    },
  });
  console.log('Admin user seeded: admin@sherman-india.com (password: Sherman@2026!)');

  // Clean existing data for clean re-seed
  await prisma.enquiry.deleteMany({});
  await prisma.proudlyServedClient.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.brand.deleteMany({});
  await prisma.productCategory.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.industry.deleteMany({});
  await prisma.siteContent.deleteMany({});

  // 2. Verified Brands from Live Website
  const brandsData = [
    {
      name: 'FCI (Fluid Components International)',
      slug: 'fci',
      logo: '/images/original/flow-measurement_ed663c7d9abc4a20a139cafedc21f016.jpg',
      websiteUrl: 'https://www.fluidcomponents.com',
      description: 'Thermal dispersion mass flow meters and flow, level, and temperature switches for air, gas, and liquid measurement.',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Intra-Automation (ITABAR)',
      slug: 'intra-automation',
      logo: '/images/original/flow-measurement_d688c6d238894a64a2d9535b30a51166.jpg',
      websiteUrl: 'https://www.intra-automation.de',
      description: 'ITABAR Averaging Pitot Tube differential pressure sensors (1/2" to 480" line sizes) and non-intrusive ultrasonic flow meters.',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'KEM Küppers Elektromechanik / TRICOR',
      slug: 'kem-tricor',
      logo: '/images/original/flow-measurement_6770e79d61d341538d306f4482e20c61.jpg',
      websiteUrl: 'https://www.kem-kueppers.com',
      description: 'TRICOR Coriolis mass flow meters, gear flow meters, turbine flow meters, and helical positive displacement flow meters.',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'SOR Inc.',
      slug: 'sor-inc',
      logo: '/images/original/process-switches_0896fa6ab3dd4072a90543dbbcaa9014.jpg',
      websiteUrl: 'https://www.sorinc.com',
      description: 'Differential pressure switches, pressure switches, level switches, and temperature switches for industrial process control.',
      displayOrder: 4,
      isActive: true,
    },
    {
      name: 'CEMB',
      slug: 'cemb',
      logo: '/images/original/balancing-machine_4584dd4f395d460fb4467240e8f91fbe.jpg',
      websiteUrl: 'https://www.cemb.com',
      description: 'Dynamic balancing machines (horizontal and vertical axis), portable vibrometers, and vibration diagnostic equipment.',
      displayOrder: 5,
      isActive: true,
    },
    {
      name: 'ZEECO',
      slug: 'zeeco',
      logo: '/images/original/combustion-control_fdaeac380b6c43f7bff75db750bfa3c4.jpg',
      websiteUrl: 'https://www.zeeco.com',
      description: 'Advanced combustion solutions, integrated UV/IR flame scanners (Zone 1 rated), modulated flame simulators, and high-energy ignitors.',
      displayOrder: 6,
      isActive: true,
    },
    {
      name: 'Scherzinger Pump Technology',
      slug: 'scherzinger',
      logo: '/images/original/fluid-control_9a8d0a5366dd4be6b9561c79361b1d68.jpg',
      websiteUrl: 'https://www.scherzinger.de',
      description: 'Fuel flow dividers for gas turbines, precision gear pumps, screw pumps, and flow dividing systems with over 80 years of engineering expertise.',
      displayOrder: 7,
      isActive: true,
    },
    {
      name: 'Mueller IE (Müller-BBM)',
      slug: 'mueller-ie',
      logo: '/images/original/vibration-monitoring-system_67c93d6c46d24d968f236dea4f1b7113.jpg',
      websiteUrl: 'https://mueller-ie.com',
      description: 'Precision industrial sensors for vibration, dynamic pressure, temperature, and multi-channel analysis.',
      displayOrder: 8,
      isActive: true,
    },
    {
      name: 'AviComp Controls',
      slug: 'avicomp-controls',
      logo: '/images/original/home_814e9f349e69470d95416b6a452963ba.jpg',
      websiteUrl: 'https://www.avicomp.de',
      description: 'Turbine and compressor control system revamping, retrofitting, and lifecycle modernization.',
      displayOrder: 9,
      isActive: true,
    },
  ];

  const brandMap = {};
  for (const b of brandsData) {
    const brand = await prisma.brand.create({
      data: b,
    });
    brandMap[b.slug] = brand.id;
  }
  console.log(`Created ${brandsData.length} verified brands.`);

  // 3. Authentic Product Categories from Live Website
  const categoriesData = [
    {
      name: 'Flow Measurement',
      slug: 'flow-measurement',
      description: 'Thermal dispersion, Averaging Pitot Tube, Coriolis mass flow, positive displacement, and ultrasonic flow meters for gases, liquids, and steam.',
      image: '/images/original/flow-measurement_ed663c7d9abc4a20a139cafedc21f016.jpg',
      icon: 'Activity',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Process Switches',
      slug: 'process-switches',
      description: 'Industrial differential pressure switches, thermal dispersion flow/level/temperature switches, and rotating machinery vibration switches.',
      image: '/images/original/process-switches_0896fa6ab3dd4072a90543dbbcaa9014.jpg',
      icon: 'ToggleLeft',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'Balancing Machine',
      slug: 'balancing-machine',
      description: 'Horizontal and vertical axis dynamic balancing machines engineered for rotors from 10 g to 100,000 kg with automatic eccentricity correction.',
      image: '/images/original/balancing-machine_4584dd4f395d460fb4467240e8f91fbe.jpg',
      icon: 'RotateCw',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'Process Technology',
      slug: 'process-technology',
      description: 'Fused glass sight windows, integrated process camera and lighting systems, high-temperature cameras (up to 2500°F), and microscopic sugar pan cameras.',
      image: '/images/original/process-technology_91232b0b3af84096af4ffafb00ffbf5d.jpg',
      icon: 'Eye',
      displayOrder: 4,
      isActive: true,
    },
    {
      name: 'Vibration Monitoring System',
      slug: 'vibration-monitoring-system',
      description: 'Machinery protection systems, SIL2/SIL3 certified accelerometers, portable vibrometers, and online condition monitoring analysis.',
      image: '/images/original/vibration-monitoring-system_67c93d6c46d24d968f236dea4f1b7113.jpg',
      icon: 'Radio',
      displayOrder: 5,
      isActive: true,
    },
    {
      name: 'Combustion Control',
      slug: 'combustion-control',
      description: 'Industrial UV/IR integrated flame scanners, Zone 1 explosion-proof flame detectors, modulated flame simulators, and high-energy ignitors.',
      image: '/images/original/combustion-control_fdaeac380b6c43f7bff75db750bfa3c4.jpg',
      icon: 'Flame',
      displayOrder: 6,
      isActive: true,
    },
    {
      name: 'Fluid Control',
      slug: 'fluid-control',
      description: 'Gas turbine fuel flow dividers, high-precision gear pumps, screw pumps, turbine pumps, and fluid distribution systems.',
      image: '/images/original/fluid-control_9a8d0a5366dd4be6b9561c79361b1d68.jpg',
      icon: 'GitFork',
      displayOrder: 7,
      isActive: true,
    },
    {
      name: 'OHE (Fittings and Accessories)',
      slug: 'ohe-fitttings-and-accessories-',
      description: 'Railway overhead line cantilevers, mechanical tensioning pulleys, section insulators, rigid catenary clamps, and electrification hardware.',
      image: '/images/original/ohe-fitttings-and-accessories-_c4a9062cb6d246d1951a12783b5839e4.jpg',
      icon: 'Zap',
      displayOrder: 8,
      isActive: true,
    },
  ];

  const categoryMap = {};
  for (const c of categoriesData) {
    const cat = await prisma.productCategory.create({
      data: c,
    });
    categoryMap[c.slug] = cat.id;
  }
  console.log(`Created ${categoriesData.length} authentic categories.`);

  // 4. Authentic Products strictly from Live Website
  const productsData = [
    // FLOW MEASUREMENT
    {
      name: 'Thermal Mass Flow Meter',
      slug: 'thermal-mass-flow-meter',
      categorySlug: 'flow-measurement',
      brandSlug: 'fci',
      image: '/images/original/flow-measurement_ed663c7d9abc4a20a139cafedc21f016.jpg',
      shortDescription: 'Patented thermal dispersion technology (AST) for air and gas flow measurement in pipes and ducts from 1/4 inch [6mm] to large stacks.',
      description: 'An FCI Thermal Mass Flow meter uses highly accurate, patented thermal dispersion technology (AST) for air and gas flow measurement. With no moving parts and minimal invasiveness, thermal flow meters provide a highly repeatable, accurate, low cost, and easy to install solution for air and gas flow measurements. Thermal dispersion mass flow meters suitable for applications in pipes and ducts, as small as 1/4 inch [6mm] to the largest of stacks.',
      specifications: JSON.stringify({
        'Technology': 'Patented Thermal Dispersion Technology (AST)',
        'Applications': 'Air and Gas Flow Measurement',
        'Line Sizes': '1/4 inch [6mm] to largest of stacks',
        'Features': 'No moving parts, minimal invasiveness, highly repeatable, accurate, low cost, easy to install',
      }),
      isPublished: true,
      isFeatured: true,
      displayOrder: 1,
    },
    {
      name: 'Averaging Pitot Tube (ITABAR)',
      slug: 'averaging-pitot-tube-itabar',
      categorySlug: 'flow-measurement',
      brandSlug: 'intra-automation',
      image: '/images/original/flow-measurement_d688c6d238894a64a2d9535b30a51166.jpg',
      shortDescription: 'Differential Pressure sensor (ITABAR, Make: Intra-Automation) for line sizes ranging from ½" to 480" (DN 20 to DN 12000).',
      description: 'The Averaging Pitot Tube (ITABAR, Make: Intra-Automation) is a Differential Pressure sensor designed for accurate flow measurement. Suitable for line sizes ranging from ½" to 480" (DN 20 to DN 12000), it excels in measuring volumetric flow of liquids, gases, and steam in closed pipes. Known for its ease of installation, the Averaging Pitot Tube ensures high reliability and consistent accuracy over a wide range of Reynolds numbers. Trusted by industries for over two decades, it offers unparalleled performance and long-term reliability.',
      specifications: JSON.stringify({
        'Make': 'Intra-Automation (ITABAR)',
        'Sensor Type': 'Differential Pressure Flow Sensor',
        'Line Size Range': '½" to 480" (DN 20 to DN 12000)',
        'Media': 'Volumetric flow of liquids, gases, and steam in closed pipes',
        'Key Advantages': 'Ease of installation, high reliability, consistent accuracy over wide range of Reynolds numbers',
      }),
      isPublished: true,
      isFeatured: true,
      displayOrder: 2,
    },
    {
      name: 'Coriolis Mass Flow Meter',
      slug: 'coriolis-mass-flow-meter',
      categorySlug: 'flow-measurement',
      brandSlug: 'kem-tricor',
      image: '/images/original/flow-measurement_6770e79d61d341538d306f4482e20c61.jpg',
      shortDescription: 'KEM make Tricor Coriolis Mass Flow Meters measuring mass flow, density, and temperature simultaneously for liquids and gases.',
      description: "KEM' make Tricor Coriolis Mass Flow Meters are highly dependable sensors suitable for diverse applications. These meters accurately measure mass flow, density, and temperature simultaneously. With a unique design and advanced manufacturing technology, they offer exceptional accuracy and robustness, remaining resilient to external factors. Whether measuring liquids or gases, Our Coriolis Mass Flow Meter delivers reliable results.",
      specifications: JSON.stringify({
        'Make': 'KEM Küppers / TRICOR',
        'Parameters Measured': 'Mass Flow, Density, and Temperature simultaneously',
        'Media': 'Liquids and Gases',
        'Design': 'Robust construction resilient to external factors with exceptional accuracy',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 3,
    },
    {
      name: 'Positive Displacement Flow Meter',
      slug: 'positive-displacement-flow-meter',
      categorySlug: 'flow-measurement',
      brandSlug: 'kem-tricor',
      image: '/images/original/flow-measurement_5609b3b88f62494ea9a965892a5528c0.jpg',
      shortDescription: 'KEM Gear Flow Meters, Turbine Flow Meters, and Helical Flow Meters using precision rotation principles.',
      description: 'KEM make Gear Flow Meters utilize enclosed, medium-filled cavities formed between the teeth and housing. The flowing medium induces free rotation of the gear pair without braking. KEM make Turbine Flow Meters employ a high-precision turbine wheel, rotating as the medium flows axially against it. KEM make Helical Flow Meters measure fluid volumetric flow using the screw wheel principle, with overlapping screw spindles in the housing, forming enclosed media-filled cavities between spindle flanks and housing.',
      specifications: JSON.stringify({
        'Make': 'KEM Küppers Elektromechanik',
        'Gear Flow Meters': 'Enclosed medium-filled cavities between teeth and housing; free gear rotation',
        'Turbine Flow Meters': 'High-precision turbine wheel rotating under axial medium flow',
        'Helical Flow Meters': 'Screw wheel principle with overlapping screw spindles in housing',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 4,
    },
    {
      name: 'Ultrasonic Flow Meter',
      slug: 'ultrasonic-flow-meter',
      categorySlug: 'flow-measurement',
      brandSlug: 'intra-automation',
      image: '/images/original/flow-measurement_e96c8d54cab542eaa8161c06a3d8933e.jpg',
      shortDescription: 'Intra-Automation ultrasonic flow meter for non-intrusive, accurate liquid and gas flow measurement with zero pressure drop.',
      description: 'IntraAutomation make ultrasonic flow meter utilizes ultrasonic waves to measure the flow rate of liquids or gases in a pipe. It is non-intrusive, accurate, and suitable for a wide range of applications, offering advantages such as low maintenance and no pressure drop.',
      specifications: JSON.stringify({
        'Make': 'Intra-Automation',
        'Measurement Principle': 'Ultrasonic Waves',
        'Media': 'Liquids or Gases in pipes',
        'Key Advantages': 'Non-intrusive, accurate, low maintenance, zero pressure drop',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 5,
    },

    // PROCESS SWITCHES
    {
      name: 'Differential Pressure Switch',
      slug: 'differential-pressure-switch',
      categorySlug: 'process-switches',
      brandSlug: 'sor-inc',
      image: '/images/original/process-switches_0896fa6ab3dd4072a90543dbbcaa9014.jpg',
      shortDescription: 'SOR differential pressure switches for filter maintenance, high static pressure flow monitoring, and process protection.',
      description: 'Differential pressure switches offer versatility across various applications, ranging from filter maintenance to monitoring high static pressure flow. These switches are designed to provide reliable performance in diverse environments, ensuring precise control and monitoring capabilities. Whether used in industrial processes, HVAC systems, or hydraulic systems, SOR differential pressure switches deliver accurate and dependable results.',
      specifications: JSON.stringify({
        'Make': 'SOR Inc.',
        'Applications': 'Filter maintenance, high static pressure flow monitoring, industrial processes, HVAC, hydraulics',
        'Performance': 'Precise control and monitoring with reliable results in diverse environments',
      }),
      isPublished: true,
      isFeatured: true,
      displayOrder: 6,
    },
    {
      name: 'Flow, Level, and Temperature Switch',
      slug: 'flow-level-temperature-switch',
      categorySlug: 'process-switches',
      brandSlug: 'fci',
      image: '/images/original/process-switches_f642a7464a0b4544ac6142d768ee6c82.jpg',
      shortDescription: 'Thermal dispersion flow switches for liquids and gases with relay, open collector, and 4-20mA outputs.',
      description: 'Thermal Mass Flow switches are electronic devices utilizing thermal dispersion flow measurement technology to provide accurate and repeatable flow rate readings, ensuring reliable setpoint detection. They are suitable for liquids (water, hydrocarbons, oils) and air/gas flows, with product solutions catering to various fluid temperatures, line sizes, and global agency approvals. Output options include relays, open collector, and 4-20mA, with configurable alarms/trip-points for flow, temperature, and more.',
      specifications: JSON.stringify({
        'Technology': 'Thermal Dispersion Flow Measurement',
        'Applicable Media': 'Liquids (water, hydrocarbons, oils) and Air/Gas flows',
        'Output Options': 'Relays, Open Collector, 4-20mA',
        'Alarms': 'Configurable alarms / trip-points for flow, temperature, and setpoints',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 7,
    },
    {
      name: 'Vibration Switch',
      slug: 'vibration-switch',
      categorySlug: 'process-switches',
      brandSlug: null,
      image: '/images/original/process-switches_19e2c2d65b66410db1d1738fcbbbac94.jpg',
      shortDescription: 'Vibration switches for industrial rotating machinery monitoring to prevent costly breakdowns and optimize performance.',
      description: 'We offers top-notch vibration switches for industrial rotating machinery, transforming equipment monitoring and maintenance practices. Our state-of-the-art technology and advanced engineering ensure the development of switches tailored to endure harsh industrial conditions. These switches deliver reliable, durable, and precise measurements, enabling early detection of potential issues. By leveraging our vibration switches, companies can prevent costly breakdowns and optimize machinery performance. Trust our expertise to enhance your operational efficiency.',
      specifications: JSON.stringify({
        'Application': 'Industrial Rotating Machinery Monitoring & Maintenance',
        'Environment': 'Engineered to endure harsh industrial conditions',
        'Key Benefits': 'Reliable, durable, precise measurements enabling early fault detection',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 8,
    },

    // BALANCING MACHINE
    {
      name: 'Dynamic Balancing Machine (Horizontal Axis)',
      slug: 'dynamic-balancing-machine-horizontal-axis',
      categorySlug: 'balancing-machine',
      brandSlug: 'cemb',
      image: '/images/original/balancing-machine_4584dd4f395d460fb4467240e8f91fbe.jpg',
      shortDescription: 'CEMB Z-Series hard-bearing horizontal axis dynamic balancing machines for rotors from 10 g to 1,00,000 kg with belt or cardan drive.',
      description: 'Suitable for balancing rotors with a known axial length and weights ranging from 10 g to 1,00,000 kg. The driving power required for rotor rotation is primarily provided by two types of drives: belt or cardan. Both drive types can be supplied together, significantly expanding the operating range and user-friendliness. All machines in the Z series feature hard bearings, allowing for immediate calibration based solely on rotor dimensions. Once correction planes are selected, adjustments on the machine involve only setting distances between these planes and their respective pedestals, as well as distances between the planes and correction diameters.',
      specifications: JSON.stringify({
        'Make': 'CEMB (Z-Series)',
        'Rotor Weight Range': '10 g to 1,00,000 kg',
        'Drive Types': 'Belt drive, Cardan drive, or Combined drive',
        'Bearing Type': 'Hard bearings (immediate calibration based solely on rotor dimensions)',
      }),
      isPublished: true,
      isFeatured: true,
      displayOrder: 9,
    },
    {
      name: 'Dynamic Balancing Machine (Vertical Axis)',
      slug: 'dynamic-balancing-machine-vertical-axis',
      categorySlug: 'balancing-machine',
      brandSlug: 'cemb',
      image: '/images/original/balancing-machine_17ba5366c1e3436982c87a599b14cad3.jpg',
      shortDescription: 'CEMB vertical axis balancing machines for rotors with reduced axial length, with weights from a few grams up to 3000 kg.',
      description: 'Suitable for balancing rotors with reduced axial length relative to the diameter, whether with or without their own shaft. Our vertical axis balancing machines are capable of measuring and correcting rotors on one or two planes, accommodating weights ranging from a few grams up to 3000 kg. When selecting a vertical balancing machine, special attention should be given to the device (adapter or tool) used to secure the rotor to the machine. It must be practical, fast, and, most importantly, accurate. Rest assured, all CEMB instruments come equipped with automatic eccentricity correction systems for added precision.',
      specifications: JSON.stringify({
        'Make': 'CEMB',
        'Rotor Weight Range': 'A few grams up to 3000 kg',
        'Correction Planes': 'One or two planes (measuring and correcting)',
        'Key Feature': 'Equipped with automatic eccentricity correction systems for added precision',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 10,
    },

    // PROCESS TECHNOLOGY
    {
      name: 'Fused Sight Glasses',
      slug: 'fused-sight-glasses',
      categorySlug: 'process-technology',
      brandSlug: null,
      image: '/images/original/process-technology_91232b0b3af84096af4ffafb00ffbf5d.jpg',
      shortDescription: 'Glass-to-metal fused sight glasses with innovative wide window, hermetic seal, Factory Mutual approval, and ASME code compliance.',
      description: 'Our sight glasses featuring the innovative wide window. Unlike conventional tempered glass windows, our fused glass windows offer unmatched safety and performance. By fusing glass to metal, we ensure a high-pressure, high-safety, hermetic seal, providing unparalleled safety with every fused sight glass we offer. Additionally, our windows are easily removable for cleaning, eliminating the need for replacement as with traditional tempered glass windows. Our fused glass windows can be reused multiple times, reducing waste and saving costs. Engineered to meet all your process and safety requirements, offered sight glasses come standard with Factory Mutual approval, ensuring the safest product available. We also provide material certification and testing, meeting ASME code requirements for process vessels if needed. Trust our sight glasses for reliable, high-quality solutions for your industrial applications.',
      specifications: JSON.stringify({
        'Technology': 'Glass fused to metal hermetic seal',
        'Window Design': 'Innovative wide window aperture',
        'Safety Approvals': 'Factory Mutual (FM) approval standard, ASME code compliant for process vessels',
        'Maintenance': 'Easily removable for cleaning, reusable multiple times without replacing glass',
      }),
      isPublished: true,
      isFeatured: true,
      displayOrder: 11,
    },
    {
      name: 'Process Camera and Lightning System',
      slug: 'process-camera-and-lightning-system',
      categorySlug: 'process-technology',
      brandSlug: null,
      image: '/images/original/process-technology_1237bf0149a44d3abb6b06042c057a89.jpg',
      shortDescription: 'Single-connection Camera & Light Vision System rated up to 10,000 PSI (690 bar) and temperatures up to 2000°F (1090°C).',
      description: "Our principle offers a unique Camera & Light Vision System designed to illuminate the interior of a pressure or process vessel through a single connection, eliminating the need for multiple ports. Our integrally mounted camera and optional light can be supplied in flanged, sanitary, or NPT threaded process connections. Analog or Ethernet CCD cameras provide real-time views inside the tank under process conditions. Utilizing OEM's fused glass technology, our system ensures a safe, high-pressure, high-temperature, hermetic fused glass barrier between the process and camera electronics. The key component of our Camera & Light Vision Systems is the Light, which utilizes fiber optic light guides to focus cool, effective light into the vessel without adding heat to the process. Our systems come with worldwide approvals and are available in various models rated up to 10,000 PSI (690 bar) and temperatures up to 2000°F (1090°C). Featuring high-resolution CCD cameras with Ethernet or analog output, our systems offer both black and white or color models. Ideal for pilot plants, our systems allow you to view and record your process remotely from the comfort of a control room. Optional features include remote light dimming options and jet spray rings for enhanced functionality. Trust our product for unparalleled live, remote imaging solutions.",
      specifications: JSON.stringify({
        'Connection': 'Single connection for camera and light (flanged, sanitary, or NPT threaded)',
        'Pressure Rating': 'Up to 10,000 PSI (690 bar)',
        'Temperature Rating': 'Up to 2000°F (1090°C)',
        'Camera Types': 'High-resolution CCD cameras with Ethernet or analog output (B&W / Color)',
        'Light Guide': 'Fiber optic light guides focusing cool light without adding heat to process',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 12,
    },
    {
      name: 'High Temperature Camera',
      slug: 'high-temperature-camera',
      categorySlug: 'process-technology',
      brandSlug: null,
      image: '/images/original/process-technology_bcf15aaff7314ca5b54c0c236a0a27a6.jpg',
      shortDescription: 'Visual inspection cameras for extreme temperature environments ranging from 750°F to 2500°F with air/water-cooled options.',
      description: 'Our High Temperature Cameras are perfectly suited for challenging applications requiring visual inspection or verification in extreme temperature environments ranging from 750°F to 2500°F. Choose between air-cooled or water-cooled options, with a fused glass seal ensuring electronics remain separated from the process. Our cameras feature non-blooming CCD technology for clear, precise imaging.',
      specifications: JSON.stringify({
        'Temperature Range': '750°F to 2500°F',
        'Cooling Options': 'Air-cooled or Water-cooled',
        'Optical Seal': 'Fused glass seal ensuring electronics remain separated from process',
        'Sensor': 'Non-blooming CCD technology for clear, precise imaging',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 13,
    },
    {
      name: 'Sugar Pan Microscopic Camera',
      slug: 'sugar-pan-microscopic-camera',
      categorySlug: 'process-technology',
      brandSlug: null,
      image: '/images/original/process-technology_492d995e886f448db5807d29f5e0e189.jpg',
      shortDescription: 'Real-time visualization of sugar crystal growth from seeding to full crystal growth with particle size analysis software.',
      description: 'For remote process monitoring, providing real-time visualisation of sugar crystal growth. This innovative solution combines our fused glass and lighting technologies, offering continuous monitoring from seeding to full crystal growth. Detect problems early and enhance process control with unrivalled clarity. Add software image analysis software for particle size and shape characterisation during crystal growth initiation.',
      specifications: JSON.stringify({
        'Application': 'Sugar pan remote process monitoring & crystal growth visualisation',
        'Coverage': 'Continuous monitoring from seeding to full crystal growth',
        'Analysis': 'Software image analysis for particle size and shape characterisation',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 14,
    },

    // VIBRATION MONITORING
    {
      name: 'Vibration Monitoring System',
      slug: 'vibration-monitoring-system',
      categorySlug: 'vibration-monitoring-system',
      brandSlug: null,
      image: '/images/original/vibration-monitoring-system_67c93d6c46d24d968f236dea4f1b7113.jpg',
      shortDescription: 'Vibration monitoring system (VMS) measuring rotating machinery vibrations to identify abnormalities and prevent failures.',
      description: 'A vibration monitoring system (VMS) measures the vibrations of rotating machinery to identify abnormalities in its condition. By detecting irregularities early, VMS can prevent machine failures and anticipate potential issues before they escalate and cause damage.',
      specifications: JSON.stringify({
        'Purpose': 'Rotating machinery condition measurement & irregularity detection',
        'Protection': 'Early abnormality identification preventing catastrophic machine failures',
      }),
      isPublished: true,
      isFeatured: true,
      displayOrder: 15,
    },
    {
      name: 'Vibrometers',
      slug: 'vibrometers',
      categorySlug: 'vibration-monitoring-system',
      brandSlug: 'cemb',
      image: '/images/original/vibration-monitoring-system_d1f4cb19a45e4cfcad009a8e1b47531c.jpg',
      shortDescription: 'Compact, handheld, rugged portable vibration meters with large color graphic display for condition monitoring.',
      description: "Portable Vibrometers offer ideal solutions for measuring and diagnosing machinery vibration. Compact, handheld, and rugged, with a large color graphic display, these multilanguage and ergonomic vibration meters are user-friendly and perfect for heavy-duty condition monitoring tasks or occasional use. Vibrometers are the go-to portable instruments for maintenance personnel, service technicians, installers, and test departments across various machinery manufacturers. From small motors and pumps to large turbines and mills, they cater to a wide range of applications. With extensive experience and highly skilled professionals, CEMB also provides training services either at its facility or on-site for customers' convenience.",
      specifications: JSON.stringify({
        'Make': 'CEMB',
        'Form Factor': 'Compact, handheld, rugged with large color graphic display',
        'Applications': 'Motors, pumps, turbines, mills, test departments',
        'Support': 'CEMB provides training services at its facility or on-site',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 16,
    },
    {
      name: 'Accelerometers',
      slug: 'accelerometers',
      categorySlug: 'vibration-monitoring-system',
      brandSlug: null,
      image: '/images/original/vibration-monitoring-system_62d85517db5b4dd1a23cc016565fe437.jpg',
      shortDescription: 'Industrial accelerometers engineered to measure and monitor vibration levels in machinery and identify faults early.',
      description: 'Industrial accelerometers, precision instruments engineered to measure and monitor vibration levels in machinery and equipment across diverse industrial applications. These accelerometers play a critical role in identifying potential faults early, such as misalignment, imbalance, or bearing wear, enabling proactive maintenance. Built to withstand rigorous conditions and offer precise sensitivity, our industrial accelerometers deliver accurate and reliable data, empowering industries to optimize efficiency, reduce downtime, and boost productivity.',
      specifications: JSON.stringify({
        'Purpose': 'Measure and monitor vibration levels in machinery and equipment',
        'Fault Detection': 'Early identification of misalignment, imbalance, or bearing wear',
        'Construction': 'Built to withstand rigorous industrial conditions with precise sensitivity',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 17,
    },
    {
      name: 'Condition Monitoring System',
      slug: 'condition-monitoring-system',
      categorySlug: 'vibration-monitoring-system',
      brandSlug: null,
      image: '/images/original/vibration-monitoring-system_67c93d6c46d24d968f236dea4f1b7113.jpg',
      shortDescription: 'Tools for online vibration analysis, machinery protection, Overspeed, Zero Speed, or Reverse Rotation with SIL2/SIL3 certification.',
      description: 'We provide a comprehensive range of tools for condition monitoring, online vibration analysis, and machinery protection systems, including Overspeed, Zero Speed, or Reverse Rotation. Our solutions encompass: Industrial accelerometers, velomitors, proximity sensors for measuring vibration, axial displacement, key phasor, and rotation speed. Vibration monitoring and protection systems, available in rack-based and din-rail mount configurations, suitable for monitoring and protecting various rotating machinery such as motors, pumps, compressors, turbines, and fans across industrial applications. Our vibration transducers, proximitors, and equipment are SIL2 or SIL3 certified, making them suitable for use in both safe and hazardous environments with ATEX and IECEX certification. Widely used in refineries, oil & gas plants, chemical industry, food processing, water & waste, energy, cement, steel, pulp & paper industries.',
      specifications: JSON.stringify({
        'Sensors': 'Accelerometers, velomitors, proximity sensors (vibration, axial displacement, key phasor, rotation speed)',
        'Configurations': 'Rack-based and DIN-rail mount systems',
        'Certifications': 'SIL2 / SIL3 certified, ATEX, IECEx for safe and hazardous areas',
        'Industries': 'Refineries, oil & gas, chemical, food, water & waste, energy, cement, steel, pulp & paper',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 18,
    },

    // COMBUSTION CONTROL
    {
      name: 'UV/IR Flame Scanner by ZEECO',
      slug: 'uv-ir-flame-scanner-by-zeeco',
      categorySlug: 'combustion-control',
      brandSlug: 'zeeco',
      image: '/images/original/combustion-control_fdaeac380b6c43f7bff75db750bfa3c4.jpg',
      shortDescription: 'Integrated flame scanners for reliable flame detection and background flame signal suppression in Zone 1 hazardous areas.',
      description: 'We offer a comprehensive range of integrated flame scanners designed for reliable flame detection and superior background flame signal suppression across single and multiple burner applications. Our flame scanners are easy to configure, simple to set up, and uniquely designed for safe operation in both hazardous and non-hazardous areas. Our industrial-grade flame scanner is ideal for industrial applications, featuring adjustable flame relay pull-in time, service dipswitch, adjust dipswitch, and raw flame signal measuring pins for advanced troubleshooting and signal analysis. Other Higher model includes additional flame relay dropout time, separate flame-on and flame-off threshold settings for frequency components, and a PC software interface. Revolutionizing the industry, our flame scanners ensure reliable flame detection and instant flame status for safer operation. Our industrial-grade flame scanner(II 2G EExd IIC T6), is uniquely designed for use in Zone 1 hazardous areas, making it a trusted solution for a wide range of applications.',
      specifications: JSON.stringify({
        'Make': 'ZEECO',
        'Type': 'UV/IR Integrated Flame Scanner',
        'Hazardous Area Rating': 'II 2G EExd IIC T6 (Zone 1 hazardous areas)',
        'Applications': 'Single and multiple burner applications',
        'Features': 'Superior background flame suppression, adjustable pull-in/dropout time, PC software interface',
      }),
      isPublished: true,
      isFeatured: true,
      displayOrder: 19,
    },
    {
      name: 'Flame Simulator by Zeeco',
      slug: 'flame-simulator-by-zeeco',
      categorySlug: 'combustion-control',
      brandSlug: 'zeeco',
      image: '/images/original/combustion-control_1713e662f0e84f6ca39559a9f72e3d73.jpg',
      shortDescription: 'Modulated flame simulator for IR and UV flame scanners operating on 9V battery with 5-minute auto switch-off.',
      description: 'Our flame simulator is designed for use with IR and UV flame scanners. It operates on a 9V alkaline battery with 500 mAh capacity and features an automatic switch-off function after approximately 5 minutes to conserve battery life. The flame simulation is modulated for accuracy. It comes with a threaded receptacle compatible with various models. The supply voltage is 9V and the frequency range can be found in the dimensional drawing. The simulator is easily mounted and constructed from aluminum, weighing approximately 1.44 lbs (0.52 kg). It has a battery life of approximately 3 years and operates within an ambient temperature range of 14°F to 140°F (-10°C to 60°C).',
      specifications: JSON.stringify({
        'Make': 'ZEECO',
        'Compatibility': 'IR and UV flame scanners',
        'Power': '9V alkaline battery (500 mAh) with 5-minute auto shutoff',
        'Weight': 'Approx. 1.44 lbs (0.52 kg), aluminum construction',
        'Temperature Range': '14°F to 140°F (-10°C to 60°C)',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 20,
    },
    {
      name: 'High Energy Ignitors by Zeeco',
      slug: 'high-energy-ignitors-by-zeeco',
      categorySlug: 'combustion-control',
      brandSlug: 'zeeco',
      image: '/images/original/combustion-control_c52af12bf1224947ac750c88fec76cdb.jpg',
      shortDescription: 'Electric Hand-Held Ignitor (HHI) and HHT torch for manual pilot ignition with instant on/off trigger.',
      description: "Our principle's electric Hand-Held Ignitor (HHI) produces a spark for manually igniting burner pilots and can be customized to any length according to specific needs. Our HHT hand-held torch operates with propane or MAPP gas and features an instant on/off trigger for fuel savings and convenience. Equipped with a built-in venturi, it generates a more consistent flame. The HHT is offered in three standard sizes: 36\", 48\", and 66\", with options for custom lengths.",
      specifications: JSON.stringify({
        'Make': 'ZEECO',
        'HHI Spark Ignitor': 'Electric spark for manually igniting burner pilots; customizable length',
        'HHT Hand-Held Torch': 'Operates with propane or MAPP gas; instant on/off trigger; built-in venturi',
        'Standard Sizes': '36", 48", 66" (with custom length options)',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 21,
    },

    // FLUID CONTROL
    {
      name: 'Fuel Flow Divider',
      slug: 'fuel-flow-divider',
      categorySlug: 'fluid-control',
      brandSlug: 'scherzinger',
      image: '/images/original/fluid-control_9a8d0a5366dd4be6b9561c79361b1d68.jpg',
      shortDescription: "Scherzinger's fuel distributors ensuring consistent fuel supply to all gas turbine combustion chambers.",
      description: "For turbines to operate flawlessly, it's crucial that all combustion chambers consistently receive fuel supply for optimal combustion. Our principle's flow dividers ensure ideal fuel flow, delivering as promised in robust design tailored for the toughest tasks. Flow Dividers by Our Principle Reliable performance assured Our principle's fuel distributors are built robustly to withstand the most challenging operating conditions. Durable Scherzinger's fuel distributors boast extended service lives and operate without failures, even under critical conditions. High Quality Our principle merges over 80 years of experience with cutting-edge technologies to deliver high-quality fuel distributors tailored to individual customer needs.",
      specifications: JSON.stringify({
        'Make': 'Scherzinger',
        'Application': 'Gas turbine combustion chamber fuel distribution',
        'Performance': 'Extended service life and reliable operation under critical conditions',
        'Heritage': 'Over 80 years of engineering experience',
      }),
      isPublished: true,
      isFeatured: true,
      displayOrder: 22,
    },
    {
      name: 'Pump Technology',
      slug: 'pump-technology',
      categorySlug: 'fluid-control',
      brandSlug: 'scherzinger',
      image: '/images/original/fluid-control_9a8d0a5366dd4be6b9561c79361b1d68.jpg',
      shortDescription: 'Gear Pumps, Screw Pumps, Flow Dividers, and Turbine Pumps engineered for industrial fluid systems.',
      description: 'Comprehensive range of Pump Technology from our principle including Gear Pumps, Screw Pumps, Flow Dividers, and Turbine Pumps designed for reliable performance in demanding industrial applications.',
      specifications: JSON.stringify({
        'Make': 'Scherzinger',
        'Product Types': 'Gear Pumps, Screw Pumps, Flow Dividers, Turbine Pumps',
        'Applications': 'Industrial fluid handling and precision flow distribution',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 23,
    },

    // RAILWAY OHE
    {
      name: 'Cantilevers',
      slug: 'cantilevers',
      categorySlug: 'ohe-fitttings-and-accessories-',
      brandSlug: null,
      image: '/images/original/ohe-fitttings-and-accessories-_c4a9062cb6d246d1951a12783b5839e4.jpg',
      shortDescription: 'Cantilever solutions for High Speed, Conventional Speed, and Tramway overhead railway lines.',
      description: 'We specialize in the design, development, and manufacture of hardware and fittings for overhead railway lines, catering to domestic railway electrification markets. Our Principle OEM is approved suppliers for leading international railway companies, ensuring our products meet the highest standards. Cantilevers are one of the key elements of overhead railway lines, as their design is key to the optimum operation of the line. In this sense, Our have the appropriate solutions for each typology and situation existing in the different types of track, whether High Speed, Conventional Speed or Tramway, due to our long relationship with the different clients and markets throughout the world. This experience provides us with the proven capability in the various types of cantilevers possible: With aluminium and copper-aluminium alloy castings, With aluminium forgings, With aluminium, steel and insulated composite tubes.',
      specifications: JSON.stringify({
        'Track Typologies': 'High Speed, Conventional Speed, Tramway',
        'Construction Types': 'Aluminium and copper-aluminium alloy castings; Aluminium forgings; Aluminium, steel and insulated composite tubes',
        'Approvals': 'Approved supplier for leading international and domestic railway authorities',
      }),
      isPublished: true,
      isFeatured: true,
      displayOrder: 24,
    },
    {
      name: 'Tensioning',
      slug: 'tensioning',
      categorySlug: 'ohe-fitttings-and-accessories-',
      brandSlug: null,
      image: '/images/original/ohe-fitttings-and-accessories-_2a620ef432634729ab88c2f7fafdba28.jpg',
      shortDescription: 'Mechanical tension systems (compensation ratio 1/3, 1/4, 1/5) with concentric pulleys, fall arrest brake, and spring tensioners.',
      description: 'Our principle, OEM, offers various mechanical tension systems to address the elongation of contact and messenger wires caused by atmospheric temperature fluctuations. These systems are defined by their compensation ratio (1/3, 1/4, or 1/5) and type, including concentric pulleys, multiple pulley systems, or springs. They are tailored to specific characteristics such as the presence of brakes or structures for supporting and guiding counterweights. Our principle\'s offerings include: Concentric toothed pulleys with a counterweight fall arrest system for cable failure/cutting. Multiple pulley systems. Spring tensioners customized based on the section to be compensated and the mechanical tension of the cables.',
      specifications: JSON.stringify({
        'Compensation Ratios': '1/3, 1/4, or 1/5',
        'System Types': 'Concentric toothed pulleys with fall arrest system, Multiple pulley systems, Customized spring tensioners',
        'Function': 'Compensates elongation of contact and messenger wires from temperature fluctuations',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 25,
    },
    {
      name: 'Other OHE Fittings and Accessories',
      slug: 'other-ohe-fittings-and-accessories',
      categorySlug: 'ohe-fitttings-and-accessories-',
      brandSlug: null,
      image: '/images/original/ohe-fitttings-and-accessories-_c4a9062cb6d246d1951a12783b5839e4.jpg',
      shortDescription: 'Section Insulator, Rigid Catenary, Clamps and Fittings, Accessories and Fixation for overhead railway electrification.',
      description: 'Here is the list of more OHE fittings and accessories that we offer: Section Insulator, Rigid Catenary, Clamps and Fittings, Accessories and Fixation.',
      specifications: JSON.stringify({
        'Components Included': 'Section Insulator, Rigid Catenary, Clamps and Fittings, Accessories and Fixation',
        'Application': 'Overhead railway line hardware and electrification fittings',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 26,
    },
    {
      name: 'Mueller Sensors',
      slug: 'mueller-sensors',
      categorySlug: 'vibration-monitoring-system',
      brandSlug: 'mueller-ie',
      image: '/images/original/vibration-monitoring-system_67c93d6c46d24d968f236dea4f1b7113.jpg',
      shortDescription: 'Mueller Sensors (Vibration, Pressure, Temperature...etc) for multi-channel condition monitoring.',
      description: 'Mueller Sensors (Vibration, Pressure, Temperature...etc) engineered for industrial machinery monitoring and multi-channel measurement analytics.',
      specifications: JSON.stringify({
        'Make': 'Mueller IE (Müller-BBM)',
        'Sensor Types': 'Vibration Sensors, Dynamic Pressure Sensors, Temperature Sensors',
        'Application Areas': 'https://mueller-ie.com/en/product-areas.html',
      }),
      isPublished: true,
      isFeatured: false,
      displayOrder: 27,
    },
  ];

  for (const p of productsData) {
    const categoryId = categoryMap[p.categorySlug];
    const brandId = p.brandSlug ? brandMap[p.brandSlug] : null;

    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        categoryId: categoryId,
        brandId: brandId,
        shortDescription: p.shortDescription,
        description: p.description,
        specifications: p.specifications,
        image: p.image,
        isPublished: p.isPublished,
        isFeatured: p.isFeatured,
        displayOrder: p.displayOrder,
      },
    });
  }
  console.log(`Created ${productsData.length} authentic products.`);

  // 5. Authentic Services from Live Website (Image-Led, NO numbering)
  const servicesData = [
    {
      name: 'Installation and Commissioning',
      slug: 'installation-and-commissioning',
      shortDescription: 'On-site assessment, mounting, wiring, calibration, testing, and full commissioning to ensure optimal performance.',
      fullDescription: 'At Sherman India, we offer comprehensive installation and commissioning services for all the instruments we supply. Our experienced technicians ensure that each instrument is installed correctly and commissioned to perform optimally. Our services include on-site assessment, where we determine the best location and configuration for the instrument installation. Our technicians handle the entire installation process, including mounting, wiring, and connection to existing systems. We also provide calibration to ensure accurate readings and testing to verify functionality. Once installation and testing are complete, we commission the instrument to ensure it is fully integrated into your system and ready for operation. With our expertise and attention to detail, you can trust us to get the job done right the first time.',
      image: '/images/original/services_8f5624b517a941ca89986b37fcf901ab.jpg',
      icon: 'Wrench',
      displayOrder: 1,
      isPublished: true,
    },
    {
      name: 'Turbines and Compressors Revamping',
      slug: 'turbines-and-compressors-revamping',
      shortDescription: 'In collaboration with AviComp Controls, modernizing outdated control systems with state-of-the-art retrofits.',
      fullDescription: "At Sherman India, we understand the importance of maximizing the lifespan and efficiency of turbines and compressors in industrial plants. That's why we offer turbine revamping services in collaboration with our partner company, AviComp Controls. While turbines and compressors are built to last, their control systems can quickly become outdated, leading to decreased efficiency, plant downtime, and unavailability of replacement parts. However, replacing perfectly functional machines at high costs is unnecessary. With AviComp Controls' retrofits, you can update your plant to the state-of-the-art in control technology, extending the lifetime of your machines and improving overall efficiency. Our turbine revamping services allow you to benefit from modern control strategies without the need for costly replacements, ensuring uninterrupted production flows and optimal plant performance.",
      image: '/images/original/home_814e9f349e69470d95416b6a452963ba.jpg',
      icon: 'Cpu',
      displayOrder: 2,
      isPublished: true,
    },
    {
      name: 'Condition Monitoring Analysis',
      slug: 'condition-monitoring-analysis',
      shortDescription: 'Comprehensive machinery health assessments utilizing advanced techniques to detect issues before failures occur.',
      fullDescription: 'At Sherman India, we offer comprehensive condition monitoring analysis services to help you optimize the performance and reliability of your industrial equipment. Our expert team utilizes advanced techniques and cutting-edge technology to assess the health and condition of your machinery, allowing you to detect potential issues before they escalate into costly downtime or failures.',
      image: '/images/original/services_22d88a7424354ffb806857e99a173dfd.jpg',
      icon: 'Activity',
      displayOrder: 3,
      isPublished: true,
    },
    {
      name: 'After Sales Support',
      slug: 'after-sales-support',
      shortDescription: 'Technical Support, Maintenance & Repair, Genuine Spare Parts Supply, Training & Education, Remote Monitoring.',
      fullDescription: 'At Sherman India, our commitment to customer satisfaction extends beyond the initial sale. We provide comprehensive after-sales support for all the instruments supplied through us, ensuring that our customers receive ongoing assistance and maintenance throughout the lifespan of their equipment. Our after-sales support services include Technical Support: Experienced technicians available for troubleshooting; Maintenance and Repair: Regular inspections, calibration, and repairs; Spare Parts Supply: Stock of genuine spare parts for quick availability; Training and Education: Programs to empower your staff; Remote Monitoring and Diagnostics: Proactive monitoring to detect potential issues early.',
      image: '/images/original/services_22d88a7424354ffb806857e99a173dfd.jpg',
      icon: 'Headphones',
      displayOrder: 4,
      isPublished: true,
    },
    {
      name: 'Sales and Marketing',
      slug: 'sales-and-marketing',
      shortDescription: 'Customary documentation, custom designing, order management, and international procurement & supply in any currency.',
      fullDescription: 'Experience seamless operations with our comprehensive services, covering customary documentation, custom designing, order management, and procurement & supply in any currency. We specialize in tailored service contracts to meet your unique needs, serving various industries such as Oil & Gas, Petrochemicals, Chemicals, Power, and more.',
      image: '/images/original/home_ac98e8708b7040e388bc1fcfded67f34.jpg',
      icon: 'Briefcase',
      displayOrder: 5,
      isPublished: true,
    },
    {
      name: 'System Integration',
      slug: 'system-integration',
      shortDescription: 'Exceptional system integration services to ensure seamless processes, enhancing efficiency and productivity.',
      fullDescription: 'At Sherman, we excel in providing exceptional system integration services to ensure seamless processes. Our dedicated team is committed to integrating systems flawlessly, enhancing efficiency and productivity. Count on us to streamline your operations and optimize your workflow, allowing you to focus on achieving your business goals.',
      image: '/images/original/home_814e9f349e69470d95416b6a452963ba.jpg',
      icon: 'GitPullRequest',
      displayOrder: 6,
      isPublished: true,
    },
    {
      name: 'Project Management',
      slug: 'project-management',
      shortDescription: 'Project-specific drawing creation, meticulous document management, scheduling, inspection, and approved testing.',
      fullDescription: 'At Sherman, we specialize in delivering remarkable project management services tailored to your needs. Our expertise includes project-specific drawing creation, meticulous document management, scheduling, inspection, and testing by approved agencies. Trust us to manage your project efficiently, ensuring exceptional results every time.',
      image: '/images/original/home_826c545ae434415b98eabfdf39850cd0.jpg',
      icon: 'FileCheck',
      displayOrder: 7,
      isPublished: true,
    },
    {
      name: 'EPC and Turnkey Contracting',
      slug: 'epc-and-turnkey-contracting',
      shortDescription: 'Tailored EPC and turnkey contracting solutions from initial planning to final commissioning.',
      fullDescription: 'At Sherman, we offer tailored EPC and turnkey contracting solutions. From initial planning to final commissioning, our expertise ensures excellence, timely delivery, and budget adherence. Trust us for precise project management, delivering outstanding results every step of the way.',
      image: '/images/original/home_7a63eddc3fe64f92ad01bbff2205115d.jpg',
      icon: 'Building2',
      displayOrder: 8,
      isPublished: true,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.create({
      data: s,
    });
  }
  console.log(`Created ${servicesData.length} authentic services.`);

  // 6. EXACT 12 Industries from Live Website with Exact Old Site Images
  const industriesData = [
    {
      name: 'Oil & Gas Industry',
      slug: 'oil-gas',
      description: 'Comprehensive range of products and industrial application solutions for the Oil & Gas Industry.',
      image: '/images/industries/oil-gas.jpg',
      icon: 'Flame',
      displayOrder: 1,
      isPublished: true,
    },
    {
      name: 'Chemical & Petrochemical',
      slug: 'chemical-petrochemical',
      description: 'Specialized flow measurement, process switches, and instrumentation for Chemical & Petrochemical plants.',
      image: '/images/industries/chemical-petrochemical.jpg',
      icon: 'FlaskConical',
      displayOrder: 2,
      isPublished: true,
    },
    {
      name: 'Process Industry',
      slug: 'process-industry',
      description: 'Application specific instrumentation and monitoring solutions for distinct Process Industry needs.',
      image: '/images/industries/process-industry.jpg',
      icon: 'Factory',
      displayOrder: 3,
      isPublished: true,
    },
    {
      name: 'Cement Industry',
      slug: 'cement-industry',
      description: 'High-temperature cameras, vibration monitoring, and robust instrumentation for Cement Industry operations.',
      image: '/images/industries/cement.jpg',
      icon: 'Building',
      displayOrder: 4,
      isPublished: true,
    },
    {
      name: 'Power Generation',
      slug: 'power-generation',
      description: 'Flow meters, balancing machines, flame scanners, and turbine revamping for Power Generation stations.',
      image: '/images/industries/power-generation.jpg',
      icon: 'Zap',
      displayOrder: 5,
      isPublished: true,
    },
    {
      name: 'Refinery',
      slug: 'refinery',
      description: 'Combustion control, flare scanning, level switches, and flow meters engineered for Petroleum Refineries.',
      image: '/images/industries/refinery.jpg',
      icon: 'Factory',
      displayOrder: 6,
      isPublished: true,
    },
    {
      name: 'Sugar Industry',
      slug: 'sugar-industry',
      description: 'Sugar pan microscopic crystal cameras, flow meters, and density instrumentation for Sugar mills.',
      image: '/images/industries/sugar.jpg',
      icon: 'Wheat',
      displayOrder: 7,
      isPublished: true,
    },
    {
      name: 'Aerospace',
      slug: 'aerospace',
      description: 'Dynamic balancing machines and high-precision sensors for Aerospace manufacturing and test stands.',
      image: '/images/industries/aerospace.jpg',
      icon: 'Plane',
      displayOrder: 8,
      isPublished: true,
    },
    {
      name: 'Railway',
      slug: 'railway',
      description: 'Railway OHE fittings, cantilevers, tensioning devices, and catenary accessories for domestic electrification.',
      image: '/images/industries/railway.jpg',
      icon: 'TrainTrack',
      displayOrder: 9,
      isPublished: true,
    },
    {
      name: 'Pharmaceutical',
      slug: 'pharmaceutical',
      description: 'Sanitary fused sight glasses, high-precision flow meters, and vision systems for Pharmaceutical processing.',
      image: '/images/industries/pharmaceutical.jpg',
      icon: 'HeartPulse',
      displayOrder: 10,
      isPublished: true,
    },
    {
      name: 'Fertilizer Industry',
      slug: 'fertilizer-industry',
      description: 'Corrosion-resistant instrumentation, switches, and flow solutions for Fertilizer production facilities.',
      image: '/images/industries/fertilizer.jpg',
      icon: 'Sprout',
      displayOrder: 11,
      isPublished: true,
    },
    {
      name: 'Marine Industry',
      slug: 'marine-industry',
      description: 'Propulsion balancing machines, fuel distributors, and vibration sensors for Marine engineering applications.',
      image: '/images/industries/marine.jpg',
      icon: 'Anchor',
      displayOrder: 12,
      isPublished: true,
    },
  ];

  for (const ind of industriesData) {
    await prisma.industry.create({
      data: ind,
    });
  }
  console.log(`Created ${industriesData.length} authentic industries with exact old site images.`);

  // 7. Site Content & Authentic History
  const historyMilestones = [
    { year: '1973', title: "Foundation as 'Sherman Corporation'", description: "'Sherman Corporation' began as a proprietorship with the aim of representing global manufacturers for the evolving Indian Process Industry." },
    { year: '1980', title: "Evolution to 'Sherman International Private Limited'", description: "Evolved from a 'product provider' to a 'solution provider', reflecting our commitment to comprehensive offerings for the evolving industry." },
    { year: '1998', title: '25 Years of Service', description: 'Celebrated 25 years of delivering quality service to the Process Industry.' },
    { year: '2022', title: '50 Years of Excellence', description: 'Celebrated 50 years of delivering quality service to the process industry.' },
  ];

  await prisma.siteContent.create({
    data: {
      key: 'company_history',
      section: 'about',
      title: 'Our History',
      subtitle: 'Over 50 Years of Delivering Quality Service to the Process Industry',
      content: JSON.stringify(historyMilestones),
    },
  });

  await prisma.siteContent.create({
    data: {
      key: 'about_overview',
      section: 'about',
      title: 'About Sherman',
      subtitle: 'Trusted Engineering Solutions Provider in India',
      content: "Sherman International Pvt. Ltd. is a trusted and forward-looking engineering solutions provider, acting as a strategic bridge between leading global manufacturers and the Indian industry. We specialize in representation, distribution, system integration, customization, and turnkey project execution across a wide range of industrial applications. Backed by a team of experienced and innovative technocrats, we work in close collaboration with our principals to deliver high-performance solutions that enhance operational efficiency, reduce costs, and ensure the highest standards of safety and reliability. Our expertise extends beyond product supply to include technical consulting, system optimization, auditing, and after-sales support—enabling our customers to achieve sustainable and long-term success. With a proven track record, Sherman has built strong partnerships with some of India's most prominent industrial organizations. Our commitment to quality, precision, and customer satisfaction makes us a preferred partner for advanced engineering solutions.",
    },
  });

  await prisma.siteContent.create({
    data: {
      key: 'vision_mission',
      section: 'about',
      title: 'Vision and Mission',
      content: JSON.stringify({
        vision: 'To be the leading provider of cutting-edge products and solutions in the fields of flow measurement, process control, analytical instrumentation, combustion technology, automation, and project documentation expertise in India, by bringing together the best industrial experts and providing the highest level of customer service.',
        mission: 'Our mission is to help our customers achieve their business objectives by offering the best possible and techno-commercially advantageous solutions. We do this by partnering with top companies in the industry, leveraging our team\'s expertise in project documentation, and providing exceptional pre-sales and after-sales support. We are committed to excellence in all that we do and strive to build long-term relationships with our customers based on trust, integrity, and mutual success.',
      }),
    },
  });

  await prisma.siteContent.create({
    data: {
      key: 'contact_info',
      section: 'contact',
      title: 'Address',
      content: JSON.stringify({
        company: 'Sherman International (P) Limited',
        address: 'E-105,(10th Floor) Himalaya House , 23, K.G. Marg New Delhi 110001, IN',
        phone: '011 23320623',
        email: 'admin@sherman-india.com',
      }),
    },
  });

  // 8. Proudly Served Authentic Clients (from Original Sherman Website)
  const clientLogosData = [
    {
      name: 'IndianOil',
      logo: '/images/clients/indianoil.png',
      websiteUrl: 'https://iocl.com',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'HMEL (HPCL-Mittal Energy Limited)',
      logo: '/images/clients/hmel.png',
      websiteUrl: 'https://www.hmel.in',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'ONGC (Oil and Natural Gas Corporation)',
      logo: '/images/clients/ongc.png',
      websiteUrl: 'https://ongcindia.com',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'Shell',
      logo: '/images/clients/shell.png',
      websiteUrl: 'https://www.shell.in',
      displayOrder: 4,
      isActive: true,
    },
    {
      name: 'NTPC Limited',
      logo: '/images/clients/ntpc.png',
      websiteUrl: 'https://www.ntpc.co.in',
      displayOrder: 5,
      isActive: true,
    },
    {
      name: 'Bharat Petroleum (BPCL)',
      logo: '/images/clients/bharat-petroleum.png',
      websiteUrl: 'https://www.bharatpetroleum.in',
      displayOrder: 6,
      isActive: true,
    },
    {
      name: 'BHEL (Bharat Heavy Electricals Limited)',
      logo: '/images/clients/bhel.png',
      websiteUrl: 'https://www.bhel.com',
      displayOrder: 7,
      isActive: true,
    },
    {
      name: 'HPCL (Hindustan Petroleum)',
      logo: '/images/clients/hpcl.png',
      websiteUrl: 'https://www.hindustanpetroleum.com',
      displayOrder: 8,
      isActive: true,
    },
    {
      name: 'Adani Group',
      logo: '/images/clients/adani.png',
      websiteUrl: 'https://www.adani.com',
      displayOrder: 9,
      isActive: true,
    },
    {
      name: 'Nayara Energy',
      logo: '/images/clients/nayara-energy.png',
      websiteUrl: 'https://www.nayaraenergy.com',
      displayOrder: 10,
      isActive: true,
    },
  ];

  for (const client of clientLogosData) {
    await prisma.proudlyServedClient.create({
      data: client,
    });
  }
  console.log(`Seeded ${clientLogosData.length} authentic Proudly Served client logos.`);

  console.log('Database successfully seeded with 100% authentic Sherman India data!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
