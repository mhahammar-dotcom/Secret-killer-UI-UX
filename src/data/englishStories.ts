// Complete English Localized Story Data for Secret Killer
// Provides full, realistic, cinematic English translations for all 13 built-in cases,
// including setting, situation, incident, stakes, objective, complete character pools (guilty & innocent),
// clues, investigation rounds, wrong vote hints, and comprehensive solutions.

import { StoryData } from '../types';

export const ENGLISH_STORIES: Record<string, Partial<StoryData>> = {
  dreams: {
    title: 'City of Dreams',
    description: 'A crime committed inside a shared lucid dream. The truth is fragmented across simulated memories, security logs, and the neural Core.',
    introduction: {
      setting: 'Neural Research Facility - Sublevel 4, where test minds are linked to a synchronized neural network each night to test the "Core" technology.',
      situation: 'Tonight is the final stress test before presenting the breakthrough project to prime investors. Everyone in the cleanroom is linked to the same dreamscape, sharing identical memories and corridors.',
      incident: 'At 21:43, an unmapped corridor materialized on the simulation grid. Minutes later, a critical partition of the Core vanished, wiping out complete blocks of the shared memory archive.',
      stakes: 'Without the Core, the simulation could collapse entirely, trapping everyone inside the dream longer than their neural synapses can endure.',
      objective: 'Before an emergency forced-awakening occurs, you must identify who opened the forbidden corridor and who is concealing the truth.'
    },
    solution: `Who is the Culprit?
Nader (Lead Core Systems Programmer), aided by conspirators inside the facility.

What did they do?
Exploited elevated system credentials to open an unmapped bypass corridor at 21:43, cloned a proprietary Core module, and initiated a memory buffer purge.

Why did they do it?
To sell the proprietary neural algorithm to a rival tech conglomerate for a multimillion-dollar payout prior to clinical trials.

How was the crime committed?
Used an emergency admin bypass key during the synchronized REM cycle while all participants were immobilized in deep dream immersion.

Which clues pointed to them?
The precise timestamp of the corridor breach (21:43), the level-4 root access required to trigger a memory purge, and unauthorized badge scans.`,
    guiltyPool: [
      {
        name: 'Nader',
        profession: 'Lead Core Systems Programmer',
        publicIdentity: 'Responsible for writing the code that powers the shared dreamscape. Everyone trusts you to maintain system stability.',
        knowledge: 'You know that the memory log is automatically purged every hour, making past events virtually untraceable over time.',
        guilty: true
      },
      {
        name: 'Salma',
        profession: 'Night Security Assistant',
        publicIdentity: 'You monitor corridor surveillance feeds and record any irregular movements during the immersion test.',
        knowledge: 'You know that an access keycard was used during a timeframe when nobody was authorized to be in the server bay.',
        guilty: true
      },
      {
        name: 'Ayman',
        profession: 'Memory Archive Intern',
        publicIdentity: 'The newest recruit on the team, tasked with archiving memory snapshots after each immersion cycle.',
        knowledge: 'You know that a backup storage drive disappeared from the vault immediately after the anomaly began, and no one has officially reported it missing yet.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'Tariq',
        profession: 'Security Systems Engineer',
        publicIdentity: 'Lead protector of the Core facility, personally auditing all access permissions and clearances.',
        knowledge: 'You know that an access keycard should not have been active at that hour of the night, but you do not know who swiped it.',
        guilty: false
      },
      {
        name: 'Hiba',
        profession: 'Memory Architecture Scientist',
        publicIdentity: 'Architect of the shared memory storage mechanism; you know every technical nuance of the neural network.',
        knowledge: 'You know that purging memory logs requires top-level administrative credentials, narrowing the suspect list significantly.',
        guilty: false
      },
      {
        name: 'Omar',
        profession: 'Clinical Neurophysiologist',
        publicIdentity: 'Responsible for monitoring the vital biological indicators of everyone plugged into the shared dream.',
        knowledge: 'You know from biometric telemetry exactly who was truly conscious and awake inside the dream at 21:43.',
        guilty: false
      },
      {
        name: 'Reem',
        profession: 'Undercover Journalist',
        publicIdentity: 'Attending tonight as an external visitor observing the trial for a future article; few know your true investigative role.',
        knowledge: 'You know that an investor secretly requested a duplicate copy of the Core the day before the test.',
        guilty: false
      },
      {
        name: 'Fadi',
        profession: 'Theoretical Physicist',
        publicIdentity: 'External consultant verifying the stability of dimensional bridges between simulated dream layers.',
        knowledge: 'You know that opening an unmapped corridor requires advanced technical know-how, excluding several non-technical staff.',
        guilty: false
      },
      {
        name: 'Lina',
        profession: 'Dreamscape Experience Designer',
        publicIdentity: 'Designer of the visual aesthetics within the shared dream, from architectural corridors to ambient lighting.',
        knowledge: 'You know that the unauthorized corridor strongly resembles one of your early unapproved prototypes that was never scheduled for tonight.',
        guilty: false
      },
      {
        name: 'Ziad',
        profession: 'Neural Network Engineer',
        publicIdentity: 'Supervisor of synaptic link cables and neural signal stability between all participants.',
        knowledge: 'You know that the momentary signal dropout was not an organic network glitch, but an intentional command executed manually.',
        guilty: false
      },
      {
        name: 'Dalia',
        profession: 'Safety Protocol Coordinator',
        publicIdentity: 'Monitoring cognitive stress telemetry to prevent test subjects from experiencing psychological trauma.',
        knowledge: 'You recorded an intense spike in brainwave activity from one participant exactly one minute before the corridor appeared.',
        guilty: false
      },
      {
        name: 'Basil',
        profession: 'Simulation UI Programmer',
        publicIdentity: 'Designing visual interfaces and virtual pathways inside the dream environment.',
        knowledge: 'You noticed that the emergency exit gate was triggered by a direct system command rather than the physical control deck.',
        guilty: false
      },
      {
        name: 'Hossam',
        profession: 'Hardware Maintenance Technician',
        publicIdentity: 'Inspecting neural interface helmets and electromagnetic sensors before every trial run.',
        knowledge: 'You confirm that all interface helmets were synchronized with zero millisecond latency at the moment of the incident.',
        guilty: false
      },
      {
        name: 'Rania',
        profession: 'Cognitive Interaction Researcher',
        publicIdentity: 'Studying subconscious psychological responses to ambient acoustic cues inside the simulation.',
        knowledge: 'You detected an anomalous repeating acoustic frequency playing in the background right before the Core partition vanished.',
        guilty: false
      }
    ],
    clues: [
      '21:43: An unmapped corridor outside the global layout was opened using elevated administrative credentials.',
      '21:47: The Core module was shifted from its vault, followed immediately by missing surveillance footage.',
      'After the breach, a keycard was detected that should have been completely inactive at that hour.'
    ],
    wrongVoteHints: [
      'The corridor was indeed opened, but that alone does not prove the keycard holder is the mastermind.',
      'The storage drive vanished after the commotion started; focus on who stood to gain from the distraction.',
      'The camera footage tampering occurred after the primary breach, not before.'
    ],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'Access Log Audit',
        publicClue: 'Digital access logs show only a single keycard was utilized to enter the memory corridor past 21:30, despite all personnel being linked in deep sleep.',
        description: 'Someone bypassed the sleep immersion or operated an active terminal while connected.',
        discussionPrompt: 'Who can explain how an active access card was swiped while everyone was supposedly immersed in sleep?'
      },
      {
        roundNumber: 2,
        title: 'Atomic Clock Glitch',
        publicClue: 'Core telemetry indicates the simulation atomic clock stalled for several seconds at 21:43, coinciding precisely with the opening of the unmapped corridor.',
        description: 'The time anomaly was timed to cover an unauthorized data transfer.',
        discussionPrompt: 'Was the clock stall a genuine technical malfunction or an intentional smokescreen?'
      },
      {
        roundNumber: 3,
        title: 'Traces in Shared Memory',
        publicClue: 'The memory architect confirms that erasing shared neural records requires rare high-level clearance possessed by very few.',
        description: 'Compare privileges and access levels to isolate the real culprit.',
        discussionPrompt: 'Who in this room holds that exact level of administrative clearance?'
      }
    ]
  },

  museum: {
    title: 'The Black Museum Heist',
    description: 'A priceless masterpiece vanishes from an underground vault during closing hours. Someone on the inside disabled the lasers.',
    introduction: {
      setting: 'In a prestigious historical museum housing the city’s most valuable art collection, locked down each evening for a handful of trusted specialists.',
      situation: 'Tonight is the annual inventory audit, and every staff member in the building has a plausible reason to be near the master vault.',
      incident: 'During closing procedures, the masterpiece vault was unlocked without any signs of forced entry, the painting vanished, and exactly one minute of camera logs disappeared.',
      stakes: 'The masterpiece is insured for tens of millions, but the museum’s global reputation will be destroyed if an insider theft is proven.',
      objective: 'Before morning detectives arrive, discover who among the present staff holds the key to the truth.'
    },
    solution: `Who is the Culprit?
Youssef (Master Art Restorer), aided by accomplices in the security wing.

What did they do?
Unlocked the masterpiece safe using bypass codes, replaced the original canvas with a forged decoy, and sanitized digital logs.

Why did they do it?
To sell the authentic masterpiece to an illicit private antiquities syndicate to cover crippling debts.

How was the crime committed?
Exploited scheduled conservation maintenance to disable the frame alarm and slipped the canvas into a drafting tube during the camera reboot.

Which clues pointed to them?
Microscopic velvet fibers on the frame, surgical cut marks on the canvas border, and authorized console access timestamps.`,
    guiltyPool: [
      {
        name: 'Youssef',
        profession: 'Master Art Restorer',
        publicIdentity: 'Responsible for restoring invaluable paintings in the museum.',
        knowledge: 'You know a specific vulnerability in the vault alarm system, because restoration work sometimes requires deactivating it under official authorization.',
        guilty: true
      },
      {
        name: 'Bilal',
        profession: 'Relief Security Guard',
        publicIdentity: 'Acting as a substitute night guard when regular personnel are absent; you know the shift rotations thoroughly.',
        knowledge: 'You know that an emergency duplicate key appeared in the staff breakroom, despite its requirement to remain in the central safe.',
        guilty: true
      },
      {
        name: 'Nabil',
        profession: 'Cybersecurity Contractor',
        publicIdentity: 'Called in tonight to patch a sudden glitch in the surveillance cameras before the inventory began.',
        knowledge: 'You know that deleting a minute of surveillance footage requires elevated technical access that very few museum staff possess.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'Ghassan',
        profession: 'Chief Museum Curator',
        publicIdentity: 'The official custodian of every masterpiece in the collection, holding master access to open the main vault.',
        knowledge: 'You know that opening the safe without physical damage is impossible without the authentic passcode, and you are one of only three who know it.',
        guilty: false
      },
      {
        name: 'Wissam',
        profession: 'Night Security Guard',
        publicIdentity: 'On duty tonight patrolling the master corridors and exhibition wings.',
        knowledge: 'You know that the service door was left unbolted for several minutes during shift handover, allowing unmonitored passage.',
        guilty: false
      },
      {
        name: 'Mona',
        profession: 'Art Journalist',
        publicIdentity: 'Invited to document the annual inventory report for an exclusive publication.',
        knowledge: 'You know that an anonymous collector attempted to purchase the missing painting privately just two days ago.',
        guilty: false
      },
      {
        name: 'Ziad',
        profession: 'Gallery Photographer',
        publicIdentity: 'Photographing artifacts and paintings under specialized UV lamps for archival records.',
        knowledge: 'You know that UV lights revealed strange handling marks around the frame that were not present yesterday.',
        guilty: false
      },
      {
        name: 'Ola',
        profession: 'Art Insurance Specialist',
        publicIdentity: 'Conducting an insurance assessment on the safety conditions of high-value exhibits.',
        knowledge: 'You know that the alarm bypass occurred from an internal maintenance panel, not an external network breach.',
        guilty: false
      },
      {
        name: 'Rand',
        profession: 'Events Coordinator',
        publicIdentity: 'Preparing the grand exhibition hall for an upcoming diplomatic reception.',
        knowledge: 'You saw someone carrying a long cylindrical blueprint tube near the vault moments before the alarm was silenced.',
        guilty: false
      },
      {
        name: 'Majid',
        profession: 'Assistant Archivist',
        publicIdentity: 'Assisting the curator in cross-checking historical serial numbers and origin certificates.',
        knowledge: 'You confirmed that the registration certificate file was opened and viewed thirty minutes before closing.',
        guilty: false
      },
      {
        name: 'Lubna',
        profession: 'Gallery Lighting Specialist',
        publicIdentity: 'Adjusting halogen and optical fiber spotlights to protect delicate pigments from thermal damage.',
        knowledge: 'You noticed that the spotlight angle above the missing masterpiece had been shifted to create a blind shadow zone.',
        guilty: false
      },
      {
        name: 'Samir',
        profession: 'Collections Care Supervisor',
        publicIdentity: 'Supervising the cleaning protocols for antique frames and marble pedestals.',
        knowledge: 'You found fine microfiber cleaning cloths discarded near the emergency exit staircase.',
        guilty: false
      },
      {
        name: 'Tariq',
        profession: 'Glass Artifact Restorer',
        publicIdentity: 'Specializing in restoring antique glass display cases and protective barriers.',
        knowledge: 'You confirm that the protective glass casing had its acoustic vibration sensors turned off from the master board.',
        guilty: false
      },
      {
        name: 'Noha',
        profession: 'Cashier & Gift Shop Manager',
        publicIdentity: 'Finalizing end-of-day register receipts in the main lobby.',
        knowledge: 'You noticed a stranger in dark attire asking detailed questions about the museum service exit layout earlier in the day.',
        guilty: false
      }
    ],
    clues: [
      'The vault safe was unlocked cleanly with zero scratches or forced entries.',
      'One full minute of camera footage was wiped between 00:15 and 00:16.',
      'Microscopic velvet fibers were retrieved from the frame mounting brackets.'
    ],
    wrongVoteHints: [
      'Knowing the safe combination is suspicious, but it does not prove the person carried out the theft.',
      'Having access to the service door does not automatically make someone the mastermind.',
      'Focus on who had the technical capability to wipe the camera log and bypass the laser grid.'
    ],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'Surveillance Log Blackout',
        publicClue: 'Surveillance records confirm the one-minute blackout was initiated from the internal maintenance terminal on the gallery floor.',
        description: 'The perpetrator was inside the gallery when the feed cut.',
        discussionPrompt: 'Who was near the gallery maintenance console when the camera feed went dark?'
      },
      {
        roundNumber: 2,
        title: 'Master Passcode Breach',
        publicClue: 'Digital logs confirm the safe was unlocked using an authorized administrative cipher known only to three senior staff members.',
        description: 'Cross-examine the movements and alibis of those with passcode clearance.',
        discussionPrompt: 'Where was each passcode holder during the 00:15 time window?'
      },
      {
        roundNumber: 3,
        title: 'Physical Trace Evidence',
        publicClue: 'Forensic swabs from the severed frame detected traces of specialized velvet gloves used exclusively in archival restoration.',
        description: 'The suspect had direct access to museum restoration gear.',
        discussionPrompt: 'Who had access to the restoration equipment and materials?'
      }
    ]
  },

  train: {
    title: 'Midnight Express',
    description: 'A sabotage and theft aboard a luxury non-stop express train. With every coach locked and speed maxed out, the culprit is trapped on board.',
    introduction: {
      setting: 'Aboard a high-speed express train traversing an isolated snowy mountain pass, with no scheduled stops until sunrise.',
      situation: 'First-class passengers and key train staff are enjoying a luxury night journey across rugged mountain terrain.',
      incident: 'As the train plunged into the Black Peak Tunnel, the emergency brake line was severed, lights flickered out, and confidential diplomatic documents vanished from the cargo safe.',
      stakes: 'The train cannot stop until dawn. The culprit is trapped among the passengers in this sealed locomotive.',
      objective: 'Track passenger movements and crew keys to expose the saboteur before reaching the destination terminal.'
    },
    solution: `Who is the Culprit?
Rami (Dining Car Server), in league with conspirators in the cargo carriage.

What did they do?
Tampered with the emergency electrical junction and used a master key to raid the diplomatic safe inside the cargo vault.

Why did they do it?
To blackmail the railway consortium and deliver classified diplomatic papers to an international smuggling cartel.

How was the crime committed?
Took advantage of the sudden darkness inside the Black Peak Tunnel while passengers were distracted by the engine stall.

Which clues pointed to them?
Traces of specialized railway grease on his uniform cuffs, and the fact that the cargo vault was opened with a conductor master key.`,
    guiltyPool: [
      {
        name: 'Rami',
        profession: 'Dining Car Server',
        publicIdentity: 'Serving beverages and gourmet meals to passengers across the dining coaches.',
        knowledge: 'You know that the service corridor connecting to the cargo car is left unlocked during the dinner rush.',
        guilty: true
      },
      {
        name: 'Salwa',
        profession: 'Traveling Ticket Inspector',
        publicIdentity: 'Verifying passenger tickets and checking cabin reservations throughout the train.',
        knowledge: 'You know that one cabin passenger was traveling under an alias not listed on the official passenger manifest.',
        guilty: true
      },
      {
        name: 'Hossam',
        profession: 'Night Sanitation Attendant',
        publicIdentity: 'Responsible for cleaning passenger compartments and restocking service supplies.',
        knowledge: 'You found an unlabelled master keycard left inside a linen cart near the engine room.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'Fouad',
        profession: 'Chief Train Conductor',
        publicIdentity: 'In total command of train operations, holding master keys to all passenger coaches.',
        knowledge: 'You know that the brake line was intentionally severed from an interior maintenance panel, not an external engine fault.',
        guilty: false
      },
      {
        name: 'Dima',
        profession: 'Emergency Physician',
        publicIdentity: 'A passenger traveling to a medical conference, attending to minor ailments on board.',
        knowledge: 'You treated a passenger who had fresh grease burns on their hands right after the tunnel blackout.',
        guilty: false
      },
      {
        name: 'Nidal',
        profession: 'Locomotive Engineer',
        publicIdentity: 'Operating the high-speed locomotive from the front cabin.',
        knowledge: 'You know that the power surge originated from Coach 3, where the cargo vault is situated.',
        guilty: false
      },
      {
        name: 'Yara',
        profession: 'Travel Photographer',
        publicIdentity: 'Documenting scenic mountain views through the observation car windows.',
        knowledge: 'You took a flash photo in the dark corridor that captured a shadowy figure running toward the rear carriage.',
        guilty: false
      },
      {
        name: 'Qasim',
        profession: 'Mysterious Passenger',
        publicIdentity: 'A quiet traveler sitting alone in the first-class lounge reading foreign newspapers.',
        knowledge: 'You know that the diplomatic pouch contained sensitive real estate contracts involving senior officials.',
        guilty: false
      },
      {
        name: 'Lama',
        profession: 'Telecommunications Officer',
        publicIdentity: 'Managing the onboard radio transmitter and satellite internet link.',
        knowledge: 'You know that an encrypted radio signal was broadcast from an unauthorized handheld radio during the blackout.',
        guilty: false
      },
      {
        name: 'Kamal',
        profession: 'Locomotive Mechanic',
        publicIdentity: 'Responsible for inspecting brake pads and pneumatic steam valves.',
        knowledge: 'You found an insulated wire-cutter left on the floor near the Coach 3 junction box.',
        guilty: false
      },
      {
        name: 'Najwa',
        profession: 'Sleeper Car Stewardess',
        publicIdentity: 'Attending to passenger requests and room service in the luxury sleeping berths.',
        knowledge: 'You noticed that the lock on Compartment 7 had been picked from the outside.',
        guilty: false
      },
      {
        name: 'Bashir',
        profession: 'Station Transit Officer',
        publicIdentity: 'Assigned to provide basic onboard security during the trans-continental run.',
        knowledge: 'You confirmed that no passengers boarded or departed between the last station and the mountain tunnel.',
        guilty: false
      },
      {
        name: 'Adel',
        profession: 'Track & Rail Inspector',
        publicIdentity: 'Traveling on board to audit high-speed track telemetry data.',
        knowledge: 'You know that the train speed remained completely constant during the blackout, proving the driver was not involved.',
        guilty: false
      },
      {
        name: 'Cyrene',
        profession: 'First-Class Stewardess',
        publicIdentity: 'Providing personalized concierge service to VIP passengers in Coach 1.',
        knowledge: 'You saw a crew member hurriedly concealing a heavy metallic tool inside their apron.',
        guilty: false
      }
    ],
    clues: [
      'The brake line was severed from inside the passenger vestibule using insulated tools.',
      'The diplomatic safe was opened with an authorized conductor master key.',
      'A handheld transmitter was activated during the blackout window.'
    ],
    wrongVoteHints: [
      'Carrying master keys is standard for train conductors; verify their specific movements during the blackout.',
      'Having grease on hands could be normal for mechanics; verify if the burns match the high-voltage fuse box.',
      'Focus on the individual who had access to both the dining vestibule and the cargo safe.'
    ],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'Breaker Box Examination',
        publicClue: 'The power relay switch was manually tripped using a specialized conductor’s insulated wrench.',
        description: 'The blackout was engineered by someone equipped with train service tools.',
        discussionPrompt: 'Who had access to the conductor crew equipment and service compartments?'
      },
      {
        roundNumber: 2,
        title: 'Master Key Log',
        publicClue: 'The cargo vault lock shows no signs of forced entry; it was opened with an authorized master key.',
        description: 'Only specific crew members held keys capable of opening the reinforced cargo safe.',
        discussionPrompt: 'Account for all master key holders during the tunnel crossing.'
      },
      {
        roundNumber: 3,
        title: 'Signal Intercept',
        publicClue: 'Onboard telecom logs show an encrypted transmission was sent to an outside receiver right as the train exited the tunnel.',
        description: 'The culprit was coordinating with external contacts.',
        discussionPrompt: 'Who had access to communication devices or handheld transmitters?'
      }
    ]
  },

  observatory: {
    title: 'Falling Star Observatory',
    description: 'During a rare celestial meteor shower, an irreplaceable cosmic sample is stolen from the telescope dome as the tracking radar goes dark.',
    introduction: {
      setting: 'Mount Celestia High-Altitude Observatory, perched atop a misty peak isolated from the city.',
      situation: 'Astronomers, technicians, and guest researchers gathered to observe a once-in-a-century meteor storm through the mega-refractor telescope.',
      incident: 'At the exact moment of peak celestial alignment, the tracking radar arrays were jammed for 90 seconds, and the glowing radioactive meteorite sample was lifted from its vacuum pedestal.',
      stakes: 'The specimen is chemically volatile and will degrade into dust if not kept in specialized cryogenic containment.',
      objective: 'Analyze telescope power feeds and security logs to catch the rogue scientist before the specimen is lost.'
    },
    solution: `Who is the Culprit?
Bashar (Tracking Systems Programmer), aided by conspirators.

What did they do?
Stole the rare cosmic meteorite sample from the pedestal and replaced it with a painted basalt decoy while the tracking arrays were jammed.

Why did they do it?
The meteorite contains rare extraterrestrial isotopes that he had arranged to sell to an illicit private research institute.

How was the crime committed?
Exploited knowledge of the backup generator cycle to kill power for 90 seconds and opened the dome hatch manually.

Which clues pointed to them?
Fingerprints on the manual dome release lever, and thermal sensor readings showing presence inside the telescope chamber during the outage.`,
    guiltyPool: [
      {
        name: 'Bashar',
        profession: 'Tracking Systems Programmer',
        publicIdentity: 'Writing and maintaining the software that aligns the main telescope with celestial coordinates.',
        knowledge: 'You know that the tracking software contains a hidden debug mode that can disable dome security sensors for two minutes.',
        guilty: true
      },
      {
        name: 'Nour',
        profession: 'Guest Visiting Astronomer',
        publicIdentity: 'Visiting from a rival observatory to compare spectral data on the meteor shower.',
        knowledge: 'You know the exact market value of the cosmic isotope sample among private international collectors.',
        guilty: true
      },
      {
        name: 'Wael',
        profession: 'Night Supply Driver',
        publicIdentity: 'Delivering liquid nitrogen and food supplies to the mountain summit.',
        knowledge: 'You have a portable cryogenic cooler container stored in the back of your mountain transport van.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'Manal',
        profession: 'Senior Astronomer',
        publicIdentity: 'Chief scientist directing the celestial observation program tonight.',
        knowledge: 'You know that the basalt decoy in the display case was placed there less than ten minutes ago.',
        guilty: false
      },
      {
        name: 'Adel',
        profession: 'Telescope Technician',
        publicIdentity: 'Responsible for mechanical gears, hydraulic mirrors, and dome rotation.',
        knowledge: 'You know that the dome emergency release lever was operated by hand from inside the upper observation gallery.',
        guilty: false
      },
      {
        name: 'Samia',
        profession: 'Meteorologist',
        publicIdentity: 'Tracking atmospheric clarity, cloud cover, and summit barometric pressure.',
        knowledge: 'You recorded an unexpected power draw from the auxiliary computer booth right at the moment of alignment.',
        guilty: false
      },
      {
        name: 'Hala',
        profession: 'Observatory Security Guard',
        publicIdentity: 'Patrolling the access gates and visitor reception desk.',
        knowledge: 'You confirm that no one entered or left through the summit security gate during the entire night.',
        guilty: false
      },
      {
        name: 'Kenan',
        profession: 'Astrophysics Graduate Student',
        publicIdentity: 'Assisting senior researchers with spectroscopic data entry.',
        knowledge: 'You saw someone carrying an insulated container through the dark stairwell leading down from the dome.',
        guilty: false
      },
      {
        name: 'Yasmine',
        profession: 'Astrophotographer',
        publicIdentity: 'Capturing long-exposure photographs of the meteor storm.',
        knowledge: 'Your long-exposure camera caught a momentary red laser reflection from the dome balcony during the blackout.',
        guilty: false
      },
      {
        name: 'Ziad',
        profession: 'Generator Technician',
        publicIdentity: 'Maintaining the diesel backup generators that supply the summit.',
        knowledge: 'You confirm that the power cut was caused by a tripped breaker in the control booth, not a generator failure.',
        guilty: false
      },
      {
        name: 'Reem',
        profession: 'Data Analysis Software Engineer',
        publicIdentity: 'Processing telescope imagery algorithms in real time.',
        knowledge: 'You discovered that the sensor logging script had its timestamp altered by five minutes.',
        guilty: false
      },
      {
        name: 'Walid',
        profession: 'Mountain Gatekeeper',
        publicIdentity: 'Stationed at the lower mountain road checkpoint.',
        knowledge: 'You observed that all vehicles parked at the summit were accounted for throughout the storm.',
        guilty: false
      },
      {
        name: 'Marwan',
        profession: 'Optical Calibration Specialist',
        publicIdentity: 'Focusing mirror arrays and precision lenses.',
        knowledge: 'You found fine scratches on the vacuum pedestal glass showing it was opened with an authorized suction lifter.',
        guilty: false
      },
      {
        name: 'Salwa',
        profession: 'Astronomical Librarian',
        publicIdentity: 'Managing historical observation logbooks and star charts.',
        knowledge: 'You noticed that the research dossier on the cosmic sample was checked out yesterday without a return stamp.',
        guilty: false
      }
    ],
    clues: [
      'The 90-second blackout was triggered by a manual override lever inside the primary dome control booth.',
      'A painted basalt decoy was left in place of the glowing cosmic meteorite.',
      'A cryogenic transport cooler was moved toward the parking area during the blackout.'
    ],
    wrongVoteHints: [
      'Having a portable cooler is standard for supply drivers; check if they were actually in the upper dome.',
      'Programming the tracking software is suspicious, but corroborate who physically moved the meteorite.',
      'Focus on the person who knew both the debug bypass code and the cryogenic handling protocol.'
    ],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'Power Grid Diagnostic',
        publicClue: 'The 90-second dome blackout was initiated via a manual override lever inside the primary telescope chamber.',
        description: 'The perpetrator was inside the dome when the blackout occurred, not outside.',
        discussionPrompt: 'Who was confirmed to be near the primary telescope chamber when the blackout hit?'
      },
      {
        roundNumber: 2,
        title: 'Decoy Examination',
        publicClue: 'Chemical analysis of the fake rock reveals fresh acrylic paint and resin dried less than two hours ago.',
        description: 'The theft was premeditated and prepared in advance.',
        discussionPrompt: 'Who had access to specimen replicas and preparation materials earlier today?'
      },
      {
        roundNumber: 3,
        title: 'Cryogenic Containment Traces',
        publicClue: 'Liquid nitrogen vapor residue was discovered near the service elevator leading to the vehicle bay.',
        description: 'The thief transferred the specimen into portable cryo-storage.',
        discussionPrompt: 'Who was observed near the service elevator or vehicle loading dock?'
      }
    ]
  },

  desert_archive: {
    title: 'Desert Archive',
    description: 'An ancient parchment detailing the coordinates of a buried desert civilization disappears from an archaeological tent before dawn.',
    introduction: {
      setting: 'An isolated expedition basecamp surrounded by vast desert dunes, miles away from civilization.',
      situation: 'An elite archaeological mission is preparing to depart into uncharted sand dunes at sunrise to locate a lost oasis city.',
      incident: 'Before the expedition caravan could load supplies, the ancient papyrus map was stolen from the locked iron expedition trunk.',
      stakes: 'Without the coordinates, the expedition cannot navigate the shifting sands and the lost city will be lost to grave robbers.',
      objective: 'Interrogate the archaeologists, navigators, and camp crew to uncover the traitor before sunrise.'
    },
    solution: `Who is the Culprit?
Sultan (Epigrapher & Inscription Expert), aided by conspirators.

What did they do?
Took the ancient parchment map from the iron chest and swapped it with blank parchment before sunrise.

Why did they do it?
To guide a rival black-market excavation team to the buried ruins and claim a fifty-percent bounty on all discovered relics.`,
    guiltyPool: [
      {
        name: 'Sultan',
        profession: 'Epigrapher & Inscription Expert',
        publicIdentity: 'Responsible for deciphering ancient scripts and stone inscriptions found at the excavation site.',
        knowledge: 'You know that the coordinates on the parchment point to a rich tomb chamber that has never been documented.',
        guilty: true
      },
      {
        name: 'Faisal',
        profession: 'Cartographer & Land Surveyor',
        publicIdentity: 'Drawing topographic maps of the desert terrain and marking camp coordinates.',
        knowledge: 'You made a secret duplicate copy of the expedition survey map yesterday evening.',
        guilty: true
      },
      {
        name: 'Jaber',
        profession: 'Desert Navigator & Guide',
        publicIdentity: 'Guiding the heavy supply trucks through shifting desert dunes and treacherous sands.',
        knowledge: 'You know an alternative desert trail that leads to the border without passing any military checkpoints.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'Suad',
        profession: 'Chief Archivist',
        publicIdentity: 'Custodian of all historical documents, scrolls, and ancient relics discovered by the expedition.',
        knowledge: 'You know that the iron chest lock was opened using a specialized pick tool, not the official master key.',
        guilty: false
      },
      {
        name: 'Rasha',
        profession: 'Expedition Medical Officer',
        publicIdentity: 'Managing field medical supplies, hydration rations, and emergency serums.',
        knowledge: 'You treated someone for a hand laceration caused by sharp metal edges around 04:00 AM.',
        guilty: false
      },
      {
        name: 'Talal',
        profession: 'Assistant Epigrapher',
        publicIdentity: 'Assisting in translating ancient symbols and copying parchment texts.',
        knowledge: 'You noticed that the ancient scroll case smelled of kerosene lamp oil that had been recently spilled.',
        guilty: false
      },
      {
        name: 'Mounira',
        profession: 'Caravan Lead Driver',
        publicIdentity: 'Driving the lead all-terrain vehicle and maintaining engine radiators.',
        knowledge: 'You saw headlights flashing in the distance toward the northern ridge around 03:30 AM.',
        guilty: false
      },
      {
        name: 'Ammar',
        profession: 'Generator Engineer',
        publicIdentity: 'Operating the camp’s electrical generator and perimeter floodlights.',
        knowledge: 'You confirm that the camp floodlights were switched off manually from the breaker switch behind the archive tent.',
        guilty: false
      },
      {
        name: 'Laith',
        profession: 'Basecamp Security Guard',
        publicIdentity: 'Standing watch around the perimeter to protect against desert predators and bandits.',
        knowledge: 'You confirm that no outside vehicle entered the camp boundaries during the night.',
        guilty: false
      },
      {
        name: 'Mazen',
        profession: 'Soil & Fossil Specialist',
        publicIdentity: 'Analyzing soil core samples to detect underground water tables and ancient foundations.',
        knowledge: 'You found heavy boot prints leading directly from the archive tent toward the supply trucks.',
        guilty: false
      },
      {
        name: 'Hind',
        profession: 'Radio Communications Officer',
        publicIdentity: 'Maintaining radio contact with the regional antiquities department.',
        knowledge: 'You intercepted an unauthorized radio broadcast transmitted on an unassigned shortwave frequency at dawn.',
        guilty: false
      },
      {
        name: 'Qutaiba',
        profession: 'Assistant Navigator',
        publicIdentity: 'Checking GPS compasses and star positions for the upcoming trek.',
        knowledge: 'You noticed that one of the spare compass units had been removed from the navigation kit.',
        guilty: false
      },
      {
        name: 'Samer',
        profession: 'Heavy-Vehicle Mechanic',
        publicIdentity: 'Checking tire pressures, winches, and fuel tanks on the expedition trucks.',
        knowledge: 'You noticed that the auxiliary fuel tank on Truck 2 was topped off secretly during the night.',
        guilty: false
      },
      {
        name: 'Yasmine',
        profession: 'Field Documentation Photographer',
        publicIdentity: 'Photographing artifacts and site progress for academic records.',
        knowledge: 'You took a photograph of the archive tent at 03:00 AM showing the entrance flap securely tied.',
        guilty: false
      }
    ],
    clues: [
      'The iron chest lock was picked with a precision wire tool before dawn.',
      'Boot prints coated in clay mud lead from the archive tent to the supply convoy.',
      'An unauthorized shortwave radio transmission was logged at 04:15 AM.'
    ],
    wrongVoteHints: [
      'Knowledge of the desert routes is common among guides; ensure physical evidence ties them to the archive tent.',
      'Making survey maps is part of a cartographer’s job; verify if they had the stolen papyrus itself.',
      'Focus on who possessed both the epigraphic translation knowledge and the picked lock traces.'
    ],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'Footprint & Sand Analysis',
        publicClue: 'Deep footprints made by heavy desert riding boots lead from the archive tent directly to the caravan supplies.',
        description: 'The thief was equipped with long-range desert riding gear.',
        discussionPrompt: 'Who was wearing riding gear and active around the archive tent before dawn?'
      },
      {
        roundNumber: 2,
        title: 'Chest Lock Inspection',
        publicClue: 'Scratches inside the tumbler lock indicate a stainless steel lockpick was used to pop the latch.',
        description: 'The thief had lockpicking tools and was not relying on the key.',
        discussionPrompt: 'Who in camp possesses precision mechanical or lockpicking tools?'
      },
      {
        roundNumber: 3,
        title: 'Radio Transmission Log',
        publicClue: 'The shortwave broadcast included numerical grid coordinates matching the secret site described on the parchment.',
        description: 'The culprit transmitted coordinates to an outside receiver.',
        discussionPrompt: 'Who had access to the coordinates and the shortwave radio gear?'
      }
    ]
  },

  drowned_village: {
    title: 'The Drowned Village',
    description: 'During a deep dive into an ancient village submerged by a dam reservoir, a priceless antique chime chest is looted from the sunken bell tower.',
    introduction: {
      setting: 'Lake Al-Wadi Reservoir - Sunken Medieval Ruins, deep below murky waters.',
      situation: 'A team of underwater archaeologists is completing a high-depth survey of a centuries-old village flooded fifty years ago.',
      incident: 'While exploring the submerged bell tower, the team’s underwater communication buoy was cut and the ornate bronze chime chest was looted.',
      stakes: 'The water pressure is rising and oxygen tanks are limited. The chest must be found before the dive team ascends to the boat.',
      objective: 'Inspect dive logs, oxygen gauges, and decompression records to identify the diver who concealed the artifact.'
    },
    solution: `Who is the Culprit?
Ramez (Rescue Diver), aided by conspirators.

What did they do?
Retrieved the antique bronze chime chest from the sunken schoolhouse and stashed it inside a spare ballast tank on the dive boat.

Why did they do it?
To evade reporting the find to the antiquities ministry and smuggle it through maritime black-market channels.`,
    guiltyPool: [
      {
        name: 'Ramez',
        profession: 'Rescue Diver',
        publicIdentity: 'Assisting in emergency diver recovery and maintaining safety lines during deep descents.',
        knowledge: 'You know that the secondary buoyancy chamber on the dive boat has an unmonitored storage hatch.',
        guilty: true
      },
      {
        name: 'Souhaila',
        profession: 'Underwater Cinematographer',
        publicIdentity: 'Filming the submerged ruins with high-definition underwater camera rigs.',
        knowledge: 'You turned your camera lights away from the bell tower for four minutes during the descent.',
        guilty: true
      },
      {
        name: 'Hatem',
        profession: 'Village Historian',
        publicIdentity: 'Providing historical maps of the village layout before it was flooded by the dam.',
        knowledge: 'You know the exact historical value of the bronze chime chest and its antique gold inscriptions.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'Abeer',
        profession: 'Dive Expedition Leader',
        publicIdentity: 'Directing the underwater archaeological exploration and managing dive schedules.',
        knowledge: 'You know that the chime chest was firmly anchored and required hydraulic bolt cutters to remove.',
        guilty: false
      },
      {
        name: 'Christina',
        profession: 'Marine Archaeologist',
        publicIdentity: 'Cataloging underwater artifacts and recording their architectural coordinates.',
        knowledge: 'You noticed fresh silt disturbance near the sunken schoolhouse that was not there during the morning dive.',
        guilty: false
      },
      {
        name: 'Dawood',
        profession: 'Hydro Dam Engineer',
        publicIdentity: 'Monitoring water currents, dam sluice gates, and reservoir depth levels.',
        knowledge: 'You confirm that the water intake currents were normal, ruling out accidental loss.',
        guilty: false
      },
      {
        name: 'Widad',
        profession: 'Relief Support Diver',
        publicIdentity: 'Standing by on the support boat ready for rapid emergency deployment.',
        knowledge: 'You saw a diver surface briefly near the boat’s stern ballast tank before re-submerging.',
        guilty: false
      },
      {
        name: 'Eyad',
        profession: 'Oxygen & Gas Technician',
        publicIdentity: 'Blending nitrox gas mixtures and checking regulator pressure valves.',
        knowledge: 'You noticed that Ramez’s oxygen tank registered a rapid pressure drop consistent with heavy physical lifting underwater.',
        guilty: false
      },
      {
        name: 'Sulafa',
        profession: 'Archival Documentation Assistant',
        publicIdentity: 'Logging photographs and diver telemetry in the boat cabin.',
        knowledge: 'You noticed that the dive camera feed had its recording cable disconnected at 14:15.',
        guilty: false
      },
      {
        name: 'Nisreen',
        profession: 'Seabed Surveyor Assistant',
        publicIdentity: 'Mapping seabed contours with underwater acoustic beacons.',
        knowledge: 'Your acoustic beacons recorded an unusual metallic clink near the old bell tower.',
        guilty: false
      },
      {
        name: 'Basil',
        profession: 'Support Boat Mechanic',
        publicIdentity: 'Maintaining the diesel boat engines and electrical winches.',
        knowledge: 'You noticed that the winch cable on the port side was unspooled without being logged in the deck book.',
        guilty: false
      },
      {
        name: 'Marwa',
        profession: 'Hyperbaric Medicine Doctor',
        publicIdentity: 'Monitoring diver decompression tables to prevent the bends.',
        knowledge: 'You confirmed that all divers adhered to safe ascent rates, indicating an experienced deep-water diver.',
        guilty: false
      },
      {
        name: 'Sherif',
        profession: 'Sonar Equipment Inspector',
        publicIdentity: 'Operating side-scan sonar to detect underwater structures.',
        knowledge: 'Sonar detected an unauthorized diver excursion toward the sunken schoolhouse at 14:20.',
        guilty: false
      },
      {
        name: 'Rana',
        profession: 'Marine Specimen Coordinator',
        publicIdentity: 'Collecting freshwater plant samples and aquatic fauna from the reservoir floor.',
        knowledge: 'You found a heavy nylon lifting sling drifting in the water near the dive ladder.',
        guilty: false
      }
    ],
    clues: [
      'The bronze chime chest was detached using heavy underwater hydraulic shears.',
      'Dive computer telemetry proves one diver consumed twice as much oxygen during a 10-minute sprint.',
      'A nylon lifting strap was found snagged on the support boat’s lower ballast keel.'
    ],
    wrongVoteHints: [
      'Filming underwater creates blind spots, but check if the camera operator physically carried the heavy chest.',
      'High oxygen consumption can happen from panic; corroborate with dive depth logs.',
      'Focus on the diver who had access to heavy cutting tools and the boat’s ballast storage.'
    ],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'Dive Computer Telemetry',
        publicClue: 'Depth records prove that one diver descended to the maximum 45-meter seabed floor without logging the excursion.',
        description: 'The thief went deep into the submerged ruins while others were surveying the shallows.',
        discussionPrompt: 'Compare oxygen consumption and depth gauges across all dive team members.'
      },
      {
        roundNumber: 2,
        title: 'Tool Manifest Check',
        publicClue: 'The heavy hydraulic shears kept in the boat’s emergency kit were wet and had bronze metal shavings on the blades.',
        description: 'The tool was used during the dive to cut the chest free.',
        discussionPrompt: 'Who had access to the boat’s emergency dive toolkit?'
      },
      {
        roundNumber: 3,
        title: 'Ballast Tank Inspection',
        publicClue: 'A search of the boat’s external hull compartments revealed fresh scratching on the secondary ballast hatch.',
        description: 'The artifact was stashed on the vessel before returning to shore.',
        discussionPrompt: 'Who was seen near the stern ballast tanks upon resurfacing?'
      }
    ]
  },

  arctic_station: {
    title: 'Last Ice Station',
    description: 'At an isolated polar research outpost during a raging blizzard, an ancient ice core containing a prehistoric biological agent disappears.',
    introduction: {
      setting: 'Aurora Borealis Polar Research Outpost, completely isolated on a vast ice shelf.',
      situation: 'The polar research team is completely isolated by a Category 5 Arctic blizzard with no rescue possible for 48 hours.',
      incident: 'The cryogenic freezer door was forced open, the backup power tripped, and a prehistoric 10,000-year-old ice cylinder went missing.',
      stakes: 'If the core melts at room temperature, ancient pathogens could be released into the station air vents.',
      objective: 'Examine cryo-storage telemetry and blizzard gear to expose the researcher who took the core.'
    },
    solution: `Who is the Culprit?
Bjorn (Vehicle & Sled Mechanic), in league with conspirators.

What did they do?
Smuggled the ancient ice cylinder out of the vault and sabotaged the backup coolant line to fake an accidental thermal loss.

Why did they do it?
The core contains a unique enzyme sequence that would grant him a multimillion-dollar payout from a private biotech firm.`,
    guiltyPool: [
      {
        name: 'Bjorn',
        profession: 'Vehicle & Sled Mechanic',
        publicIdentity: 'Maintaining snowmobiles, heated tracked crawlers, and heavy generator engines.',
        knowledge: 'You have an insulated field cryo-flask hidden inside the engine bay of Snowmobile 3.',
        guilty: true
      },
      {
        name: 'Ingrid',
        profession: 'Glaciologist & Ice Expert',
        publicIdentity: 'Extracting and analyzing deep ice core samples from the polar shelf.',
        knowledge: 'You know the exact commercial worth of the prehistoric organic compounds preserved in that specific core.',
        guilty: true
      },
      {
        name: 'Felix',
        profession: 'Station Chef',
        publicIdentity: 'Managing the galley, food rations, and walk-in freezer storage.',
        knowledge: 'You know how to manipulate the temperature alarms in the walk-in cold storage units.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'Anja',
        profession: 'Senior Climatologist',
        publicIdentity: 'Station director leading research into historical paleoclimate cycles.',
        knowledge: 'You know that the ice core cylinder requires constant sub-zero temperatures to prevent catastrophic thawing.',
        guilty: false
      },
      {
        name: 'Lars',
        profession: 'Station Doctor',
        publicIdentity: 'Managing medical care, hypothermia protocols, and biological containment safety.',
        knowledge: 'You noticed someone with severe frostbite blisters on their fingers who refused medical treatment.',
        guilty: false
      },
      {
        name: 'Sigrid',
        profession: 'Radio Communications Controller',
        publicIdentity: 'Monitoring the high-frequency satellite transceiver through the blizzard.',
        knowledge: 'You intercepted a burst transmission sent to an unlisted maritime ship off the coast right before the power cut.',
        guilty: false
      },
      {
        name: 'Magnus',
        profession: 'Power Grid Technician',
        publicIdentity: 'Monitoring the station’s diesel generators and heating coils.',
        knowledge: 'You confirm that the coolant line was intentionally cut with a surgical utility blade, not cracked by cold.',
        guilty: false
      },
      {
        name: 'Tova',
        profession: 'Polar Marine Biologist',
        publicIdentity: 'Studying Arctic microbial life and sub-ice algae specimens.',
        knowledge: 'You saw wet snow boots in the airlock showing someone ventured out to the exterior storage shed during the storm.',
        guilty: false
      },
      {
        name: 'Oscar',
        profession: 'Field Research Assistant',
        publicIdentity: 'Assisting scientists with core drilling rigs on the ice shelf.',
        knowledge: 'You noticed that the combination lock on the specimen vault had its security seal broken.',
        guilty: false
      },
      {
        name: 'Erik',
        profession: 'Weather Radar Technician',
        publicIdentity: 'Tracking blizzard barometric pressure and wind chill speeds.',
        knowledge: 'You know that wind speeds outside made it impossible for anyone to flee the station on foot.',
        guilty: false
      },
      {
        name: 'Hilda',
        profession: 'Assistant Climatologist',
        publicIdentity: 'Logging temperature gradients in the ice archive room.',
        knowledge: 'You discovered that the temperature log was manually frozen at -20°C using an electronic override.',
        guilty: false
      },
      {
        name: 'Kasper',
        profession: 'Snowplow Operator',
        publicIdentity: 'Clearing snowdrifts from the station entry tunnels and hangar doors.',
        knowledge: 'You noticed that the snowmobile hangar doors were unlatched from the inside.',
        guilty: false
      },
      {
        name: 'Mikael',
        profession: 'Environmental Safety Officer',
        publicIdentity: 'Auditing biohazard filters and ventilation scrubbers.',
        knowledge: 'You confirmed that the ventilation exhaust filters were clean, meaning no airborne spores escaped inside.',
        guilty: false
      },
      {
        name: 'Katrin',
        profession: 'Supply & Nutrition Specialist',
        publicIdentity: 'Inventorying dry food crates and emergency thermal blankets.',
        knowledge: 'You discovered that two high-grade thermal insulation blankets were missing from the supply shelf.',
        guilty: false
      }
    ],
    clues: [
      'The coolant pipe was sliced cleanly with an insulated utility blade.',
      'Fresh snow boot tracks led from the specimen freezer to the exterior vehicle hangar.',
      'A portable insulated cryo-flask was missing from the mobile survey kit.'
    ],
    wrongVoteHints: [
      'Operating freezers is routine for station cooks; verify who had the equipment to transport the ice safely.',
      'Checking snowmobiles is normal for mechanics; verify if the insulated flask contains the stolen core.',
      'Focus on the person who knew how to bypass the electronic temperature alarm and access the vehicle bay.'
    ],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'Thermal Sensor Log',
        publicClue: 'Thermal cameras show a heat signature carrying a portable cryo-flask through the west corridor at 02:15 AM.',
        description: 'The culprit transported the core immediately before the alarm wires were severed.',
        discussionPrompt: 'Who was unaccounted for in their sleeping quarters around 02:00 AM?'
      },
      {
        roundNumber: 2,
        title: 'Airlock Boot Log',
        publicClue: 'The electronic airlock log confirms the outer door to the snowmobile garage was opened for ninety seconds during the blizzard.',
        description: 'The thief transferred the stolen sample into the vehicle bay.',
        discussionPrompt: 'Who had access to the snowmobile hangar keys during the night shift?'
      },
      {
        roundNumber: 3,
        title: 'Coolant Pipe Forensics',
        publicClue: 'Tool marks on the copper coolant tubing match a heavy mechanic’s wire-stripping tool.',
        description: 'The sabotage was executed with mechanical tools.',
        discussionPrompt: 'Who had access to the mechanical workshop tool chests?'
      }
    ]
  },

  film_set: {
    title: 'The Final Scene',
    description: 'On the glamorous set of a classic historical movie, the genuine royal antique ring vanishes from the prop table right before the final climax scene is shot.',
    introduction: {
      setting: 'CineStar Studios - Soundstage 7, adorned with lavish period decor.',
      situation: 'The cast and crew are filming the high-stakes final scene of a multimillion-dollar period drama.',
      incident: 'Just before the director shouted "Action!", the real heirloom diamond ring was replaced with a cheap brass prop on the velvet cushion.',
      stakes: 'The authentic ring is on loan from a private museum under heavy insurance liability. No one leaves the soundstage until it is recovered.',
      objective: 'Interrogate the director, actors, prop master, and costumers to identify the thief.'
    },
    solution: `Who is the Culprit?
Karim (Master of Props), in league with conspirators.

What did they do?
Swapped the authentic diamond heirloom ring with a polished brass replica right before the cameras started rolling.

Why did they do it?
The ring originally belonged to his ancestral estate and was sold at an unauthorized auction decades ago; he vowed to reclaim it.`,
    guiltyPool: [
      {
        name: 'Karim',
        profession: 'Master of Props',
        publicIdentity: 'Managing every piece of stage weaponry, antique jewelry, and historical set dressing.',
        knowledge: 'You crafted an identical brass replica of the diamond ring in your workshop three days ago.',
        guilty: true
      },
      {
        name: 'Salma',
        profession: 'Costume & Wardrobe Designer',
        publicIdentity: 'Designing lavish royal gowns and historical suits for the leading actors.',
        knowledge: 'You have a concealed zippered pocket sewn inside the lining of the Queen’s velvet cape.',
        guilty: true
      },
      {
        name: 'Issam',
        profession: 'Production Assistant',
        publicIdentity: 'Carrying call sheets, running errands for the director, and locking soundstage doors.',
        knowledge: 'You turned off the soundstage entrance security camera so external crew could enter unmonitored.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'Sarah',
        profession: 'Film Director',
        publicIdentity: 'Directing the production and orchestrating the final dramatic climax.',
        knowledge: 'You noticed the brass replica on the cushion looked dull under the studio spotlights ten minutes before filming.',
        guilty: false
      },
      {
        name: 'Walid',
        profession: 'Cinematographer & DOP',
        publicIdentity: 'Setting camera lenses, lighting ratios, and dolly track movements.',
        knowledge: 'Your high-speed camera recorded a crew member standing unnaturally close to the prop table during lighting setup.',
        guilty: false
      },
      {
        name: 'Nadine',
        profession: 'Lead Makeup Artist',
        publicIdentity: 'Applying period makeup and styling wigs for the lead actors in their dressing rooms.',
        knowledge: 'You saw Karim polishing a metallic object with a velvet cloth in the dark wing of the stage.',
        guilty: false
      },
      {
        name: 'Rami',
        profession: 'Stunt Double',
        publicIdentity: 'Performing sword fights and acrobatic stunts for the male lead.',
        knowledge: 'You noticed that the prop master’s lockbox was left unlocked on the side table.',
        guilty: false
      },
      {
        name: 'Hiba',
        profession: 'Studio Public Relations Manager',
        publicIdentity: 'Coordinating media coverage and managing insurance paperwork for museum loans.',
        knowledge: 'You know that the museum insurance representative was scheduled to inspect the ring immediately after the scene wrapped.',
        guilty: false
      },
      {
        name: 'Zain',
        profession: 'Assistant Director',
        publicIdentity: 'Calling cues, managing background extras, and keeping the filming schedule.',
        knowledge: 'You confirm that all soundstage emergency exits were locked from the inside throughout filming.',
        guilty: false
      },
      {
        name: 'Majid',
        profession: 'Field Sound Engineer',
        publicIdentity: 'Operating boom microphones and monitoring dialogue audio feeds.',
        knowledge: 'Your directional boom mic picked up a metallic click near the prop table while the crew was distracted.',
        guilty: false
      },
      {
        name: 'Dalal',
        profession: 'Assistant Costume Stylist',
        publicIdentity: 'Steaming costumes and adjusting corsets between takes.',
        knowledge: 'You found jeweler’s buffing compound smeared on a costume cloth in the prop room.',
        guilty: false
      },
      {
        name: 'Tamer',
        profession: 'Cinematography Lighting Supervisor',
        publicIdentity: 'Adjusting overhead spotlights and dimmers above the set.',
        knowledge: 'You noticed someone climbing the gantry walkway near the overhead spotlight grid right before the scene.',
        guilty: false
      },
      {
        name: 'Fadi',
        profession: 'Special Effects Technician',
        publicIdentity: 'Operating smoke machines and stage spark charges.',
        knowledge: 'You confirm that the smoke machine was triggered early, creating a brief fog haze around the prop table.',
        guilty: false
      },
      {
        name: 'Mona',
        profession: 'Stunt & Movement Choreographer',
        publicIdentity: 'Choreographing the royal court dance and sword movements.',
        knowledge: 'You noticed that the velvet display cushion was shifted from its taped mark on the side table.',
        guilty: false
      }
    ],
    clues: [
      'The velvet prop cushion retained traces of jeweler’s buffing compound.',
      'The brass ring replica was placed on the cushion during the 5-minute smoke haze.',
      'The authentic diamond ring was concealed inside a hollow stage spotlight casing.'
    ],
    wrongVoteHints: [
      'Having access to actors’ costumes is normal for stylists; verify who had access to the prop cushion.',
      'Triggering smoke machines could be a miscue; verify who took advantage of the fog.',
      'Focus on the person who had the jewelry crafting skill to forge the brass decoy in advance.'
    ],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'Prop Master Log Book',
        publicClue: 'The velvet prop cushion retains traces of jeweler’s buffing compound used exclusively in the prop workshop.',
        description: 'The switch was prepared in advance by someone with access to jewelry forging tools.',
        discussionPrompt: 'Who had physical access to the jewelry prop box in the workshop?'
      },
      {
        roundNumber: 2,
        title: 'Lighting Gantry Inspection',
        publicClue: 'A hollow spotlight housing on the overhead gantry shows fresh scuff marks from someone reaching inside.',
        description: 'The ring was hidden high above the soundstage floor.',
        discussionPrompt: 'Who was observed near the overhead gantry stairs before filming began?'
      },
      {
        roundNumber: 3,
        title: 'Rehearsal Footage Review',
        publicClue: 'Video playback reveals the authentic ring was on the table at 15:45, but was swapped during the smoke haze at 15:50.',
        description: 'The switch happened during the 5-minute smoke test.',
        discussionPrompt: 'Where was each suspect standing during the smoke machine test?'
      }
    ]
  },

  submarine: {
    title: 'Call of the Depths',
    description: 'Aboard a deep-sea research submarine descending into an abyss trench, the navigation data chip is extracted to redirect the sub toward uncharted coordinates.',
    introduction: {
      setting: 'Deep Ocean Submersible "Nautilus-X", deep within an oceanic trench.',
      situation: 'The crew is descending past 3,000 meters into an unexplored ocean trench under immense hydraulic pressure.',
      incident: 'The encrypted navigation chip vanished from the bridge console, causing guidance systems to deviate toward classified coordinates.',
      stakes: 'If the navigation chip is not re-inserted within thirty minutes, the sub will enter dangerous hydrothermal vent zones.',
      objective: 'Question the bridge officers, sonar technicians, and oceanographers to find the saboteur.'
    },
    solution: `Who is the Culprit?
Tariq (Navigation Officer), in league with conspirators.

What did they do?
Extracted the encrypted navigation memory chip to force the submarine toward the hidden coordinates of a secret historic shipwreck.

Why did they do it?
To locate and document a sunken treasure galleon before salvage rights expired.`,
    guiltyPool: [
      {
        name: 'Tariq',
        profession: 'Navigation Officer',
        publicIdentity: 'Responsible for plotting descent vectors and steering the sub through deep-sea trenches.',
        knowledge: 'You have a secondary chart showing the coordinates of a centuries-old sunken galleon laden with gold bullion.',
        guilty: true
      },
      {
        name: 'Lina',
        profession: 'Submarine Captain',
        publicIdentity: 'Overall commander of the vessel, holding master clearance for all ship operations.',
        knowledge: 'You approved the detour route into the trench without logging the change with naval headquarters.',
        guilty: true
      },
      {
        name: 'Faris',
        profession: 'Propulsion & Engine Specialist',
        publicIdentity: 'Managing the electric thrusters, main battery banks, and ballast pumps.',
        knowledge: 'You deliberately increased the thruster RPM to speed up the sub toward the unmapped trench coordinates.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'Haitham',
        profession: 'Expedition Medical Doctor',
        publicIdentity: 'Monitoring crew vitals, oxygen saturation, and atmospheric pressure inside the hull.',
        knowledge: 'You treated a crew member who suffered minor electrical burns from the navigation terminal console.',
        guilty: false
      },
      {
        name: 'Maya',
        profession: 'Deep-Sea Marine Biologist',
        publicIdentity: 'Observing bioluminescent organisms through the forward quartz viewport.',
        knowledge: 'You noticed the submarine’s heading changed thirty degrees to the northeast right before the alarm sounded.',
        guilty: false
      },
      {
        name: 'Samer',
        profession: 'Sonar Array Technician',
        publicIdentity: 'Monitoring active sonar pings and acoustic seabed mapping.',
        knowledge: 'Sonar detected an uncharted metallic mass on the seabed floor directly along the altered heading.',
        guilty: false
      },
      {
        name: 'Nada',
        profession: 'Communications Officer',
        publicIdentity: 'Maintaining the acoustic underwater telephone link to the surface support vessel.',
        knowledge: 'You discovered that the surface communication antenna had been manually switched to an offline frequency.',
        guilty: false
      },
      {
        name: 'Adnan',
        profession: 'Assistant Navigator',
        publicIdentity: 'Assisting with gyroscopic compass readings and depth gauge logs.',
        knowledge: 'You know that removing the navigation chip requires an anti-static magnetic key kept only at the helm station.',
        guilty: false
      },
      {
        name: 'Rita',
        profession: 'Cabin Pressure & Safety Specialist',
        publicIdentity: 'Verifying titanium hull integrity and monitoring oxygen scrubbers.',
        knowledge: 'You confirm that all emergency life support systems remain fully operational.',
        guilty: false
      },
      {
        name: 'Wafiq',
        profession: 'Torpedo & Hull Mechanic',
        publicIdentity: 'Inspecting hydraulic seals, robotic arms, and external specimen baskets.',
        knowledge: 'You noticed that the external manipulator arm was armed and ready for deep retrieval.',
        guilty: false
      },
      {
        name: 'Jihan',
        profession: 'Assistant Communications Officer',
        publicIdentity: 'Logging acoustic signals and depth sounder telemetry.',
        knowledge: 'You found the magnetic keycard slot on the navigation console unlocked and glowing amber.',
        guilty: false
      },
      {
        name: 'Marwan',
        profession: 'Cooling Systems Assistant',
        publicIdentity: 'Checking battery cooling loops and hydraulic pump pressure.',
        knowledge: 'You noticed that the cooling pump was operating at maximum capacity to support high-speed cruising.',
        guilty: false
      },
      {
        name: 'Bassem',
        profession: 'Oxygen Filter Technician',
        publicIdentity: 'Replacing chemical carbon dioxide scrubber canisters.',
        knowledge: 'You saw someone stuffing a small metallic object inside the bridge ventilation intake filter.',
        guilty: false
      },
      {
        name: 'Najla',
        profession: 'Assistant Medical Officer',
        publicIdentity: 'Administering motion sickness remedies and checking oxygen masks.',
        knowledge: 'You confirmed that all medical lockers remained sealed and accounted for.',
        guilty: false
      }
    ],
    clues: [
      'The navigation chip was extracted using the helm station’s anti-static magnetic key.',
      'The sub’s heading was manually locked toward uncharted coordinates harboring a sunken wreck.',
      'The stolen memory chip was hidden inside the bridge air intake filter.'
    ],
    wrongVoteHints: [
      'Monitoring sonar is part of a sonar tech’s job; verify who physically pulled the navigation chip.',
      'Handling thruster speeds does not automatically make the engineer the mastermind without navigation motive.',
      'Focus on the person who possessed the secret shipwreck coordinates and the magnetic console key.'
    ],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'Bridge Access Console',
        publicClue: 'The navigation slot was opened using the helm station’s anti-static magnetic key.',
        description: 'Only navigation specialists had the required bypass key to release the chip.',
        discussionPrompt: 'Who operated the navigation and sonar console before the heading shifted?'
      },
      {
        roundNumber: 2,
        title: 'Ventilation Filter Search',
        publicClue: 'A tiny silicon memory chip was discovered lodged behind the bridge air intake grill.',
        description: 'The thief stashed the chip inside the bridge cabin rather than leaving it in their pocket.',
        discussionPrompt: 'Who was seen lingering near the bridge air intake grill?'
      },
      {
        roundNumber: 3,
        title: 'Sonar Target Analysis',
        publicClue: 'Sonar pings reveal that the sub was steered directly toward a high-density metallic shipwreck in the trench.',
        description: 'The course change was an intentional treasure-hunting maneuver.',
        discussionPrompt: 'Who had knowledge of the historic shipwreck coordinates?'
      }
    ]
  },

  court: {
    title: 'The Silent Case',
    description: 'Moments before the final verdict in a historic courthouse, the single piece of decisive written evidence vanishes from the locked evidence vault.',
    introduction: {
      setting: 'High Court of Justice - Evidence Archive, a historic neoclassical hall of law.',
      situation: 'A landmark corporate corruption trial is reaching its climax as the jury prepares to deliver the final verdict.',
      incident: 'The locked steel safe inside the evidence vault was found empty—the original signed confession document was swapped with blank paper.',
      stakes: 'If the original document is destroyed, the guilty oligarch will walk free without possibility of appeal.',
      objective: 'Interrogate court clerks, security bailiffs, and legal counsels to unmask the corrupt insider.'
    },
    solution: `Who is the Culprit?
Adli (Courthouse Security Guard), in league with conspirators.

What did they do?
Unlocked the evidence vault with a duplicate key, took the signed confession, and destroyed it in the basement furnace.

Why did they do it?
To secure a massive bribe from the defendant’s syndicate to guarantee an acquittal.`,
    guiltyPool: [
      {
        name: 'Adli',
        profession: 'Courthouse Building Security Guard',
        publicIdentity: 'Guarding the judicial archive wing and monitoring corridor security gates.',
        knowledge: 'You have a duplicate brass key to the evidence archive room that was never registered with the chief clerk.',
        guilty: true
      },
      {
        name: 'Mounira',
        profession: 'Chief Court Clerk',
        publicIdentity: 'Managing official judicial dockets, case files, and court evidence registries.',
        knowledge: 'You know the daily digital combination code that opens the master evidence safe.',
        guilty: true
      },
      {
        name: 'Jawad',
        profession: 'Forensics & Fingerprint Specialist',
        publicIdentity: 'Authenticating physical evidence and presenting forensic reports to the court.',
        knowledge: 'You know that the confession document had unique embossed watermarks that are impossible to forge.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'Farida',
        profession: 'Senior Prosecutor',
        publicIdentity: 'Leading the state’s prosecution against the corrupt corporate syndicate.',
        knowledge: 'You know that the signed confession was the linchpin that would secure a guaranteed life sentence.',
        guilty: false
      },
      {
        name: 'Sameh',
        profession: 'Defense Attorney',
        publicIdentity: 'Representing the defendant in the high-profile courtroom trial.',
        knowledge: 'You were in the judge’s chambers arguing a procedural motion when the vault was breached.',
        guilty: false
      },
      {
        name: 'Rawia',
        profession: 'Courtroom Journalist',
        publicIdentity: 'Reporting on the trial proceedings for a national daily newspaper.',
        knowledge: 'You saw a guard hurriedly carrying a heavy brown leather folder down toward the furnace basement.',
        guilty: false
      },
      {
        name: 'Nabih',
        profession: 'Court Recording Stenographer',
        publicIdentity: 'Transcribing every spoken word during the legal proceedings.',
        knowledge: 'You recorded that the chief clerk left the courtroom for eight minutes right before the evidence was called.',
        guilty: false
      },
      {
        name: 'Aida',
        profession: 'Legal Records Archivist',
        publicIdentity: 'Organizing historic case files and legal precedent libraries.',
        knowledge: 'You noticed that the evidence safe’s logbook had its latest entry line crossed out with black ink.',
        guilty: false
      },
      {
        name: 'Zuhair',
        profession: 'Legal Document Authenticator',
        publicIdentity: 'Inspecting wax seals, watermarks, and notary signatures on legal deeds.',
        knowledge: 'You examined the blank paper in the safe and found it came from the court’s official stationery room.',
        guilty: false
      },
      {
        name: 'Khalil',
        profession: 'Evidence Vault Custodian',
        publicIdentity: 'Holding the official keys to the evidence archive door.',
        knowledge: 'You confirm that the evidence room deadbolt was unlocked with a working key, not forced open with a crowbar.',
        guilty: false
      },
      {
        name: 'Ilham',
        profession: 'Assistant Stenographer',
        publicIdentity: 'Assisting in filing official court transcripts.',
        knowledge: 'You noticed the smell of burning paper coming from the basement ventilation duct.',
        guilty: false
      },
      {
        name: 'Raouf',
        profession: 'Judicial Security Supervisor',
        publicIdentity: 'Overseeing all bailiffs and metal detector checkpoints in the courthouse.',
        knowledge: 'You confirm that all exterior courthouse doors remained locked with no unauthorized entries.',
        guilty: false
      },
      {
        name: 'Bashir',
        profession: 'Courtroom Bailiff',
        publicIdentity: 'Maintaining order inside the courtroom and escorting witnesses to the stand.',
        knowledge: 'You saw someone in uniform standing by the evidence vault door ten minutes before the session resumed.',
        guilty: false
      },
      {
        name: 'Wafaa',
        profession: 'Law Library Researcher',
        publicIdentity: 'Researching statutory laws and legal precedents for the judiciary.',
        knowledge: 'You noticed that the defense legal team made several urgent phone calls right before the break.',
        guilty: false
      }
    ],
    clues: [
      'The evidence safe was opened cleanly using the daily master code and a duplicate key.',
      'Burnt fragments of embossed legal paper were found in the courthouse basement incinerator.',
      'The logbook entry for the evidence safe was intentionally redacted with black ink.'
    ],
    wrongVoteHints: [
      'Having access to case files is standard for clerks; verify who had access to the basement incinerator.',
      'Defending the accused is an attorney’s legal role; verify their physical alibi during the break.',
      'Focus on who had both the duplicate key to the archive room and the physical opportunity to burn the document.'
    ],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'Vault Seal Inspection',
        publicClue: 'The evidence safe combination lock was opened without damage using the master key sequence.',
        description: 'The theft was carried out by someone with legitimate custodial access.',
        discussionPrompt: 'Who possessed the daily safe combination code and vault keys?'
      },
      {
        roundNumber: 2,
        title: 'Basement Furnace Ash Analysis',
        publicClue: 'Ash retrieved from the basement furnace contains traces of gold foil matching the official court seal.',
        description: 'The confession was burned in the basement furnace immediately after being taken.',
        discussionPrompt: 'Who was seen going to or returning from the basement furnace room?'
      },
      {
        roundNumber: 3,
        title: 'Logbook Redaction Forensics',
        publicClue: 'UV analysis of the redacted logbook entry reveals the badge number of the guard on duty.',
        description: 'The cover-up attempted to hide the guard’s sign-in timestamp.',
        discussionPrompt: 'Whose signature and badge number was concealed in the evidence logbook?'
      }
    ]
  },

  greenhouse: {
    title: 'Night in the Greenhouse',
    description: 'A miraculous medicinal plant species is stolen from an airtight Victorian glass conservatory on the eve of its global announcement.',
    introduction: {
      setting: 'Royal Botanical Conservatory - Specimen Pavilion, an airtight Victorian glass greenhouse.',
      situation: 'Botanists, pharmaceutical researchers, and benefactors gathered to celebrate the blooming of a rare synthetic orchid.',
      incident: 'Under cover of a severe rainstorm, the climate-controlled glass terrarium was breached and the unique specimen was uprooted.',
      stakes: 'The orchid will wilt and die if not placed in high-humidity nutrient soil within two hours.',
      objective: 'Question the botanists, caretakers, and researchers to locate the stolen specimen before it perishes.'
    },
    solution: `Who is the Culprit?
Dani (Irrigation Systems Technician), in league with conspirators.

What did they do?
Cut the terrarium glass with a diamond-tip scribe, uprooted the orchid, and stashed it in an insulated humidified flask.

Why did they do it?
To deliver the live plant to an international agro-chemical conglomerate for a massive bounty.`,
    guiltyPool: [
      {
        name: 'Dani',
        profession: 'Irrigation Systems Technician',
        publicIdentity: 'Maintaining automated misting nozzles, nutrient pumps, and greenhouse moisture levels.',
        knowledge: 'You have an insulated field flask equipped with an integrated battery-powered misting pump in your tool locker.',
        guilty: true
      },
      {
        name: 'Wafaa',
        profession: 'Plant Toxicology Specialist',
        publicIdentity: 'Analyzing alkaloid poisons, medicinal resins, and biological defense mechanisms in rare flora.',
        knowledge: 'You know the exact biochemical compounds required to keep the synthetic orchid alive outside its terrarium.',
        guilty: true
      },
      {
        name: 'Rafi',
        profession: 'Botanical Magazine Photographer',
        publicIdentity: 'Photographing rare blooming cycles for international horticultural publications.',
        knowledge: 'You know that the conservatory security cameras have a major blind spot behind the tropical fern canopy.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'Nadia',
        profession: 'Senior Botanist',
        publicIdentity: 'Lead researcher who spent a decade cultivating the miracle medicinal orchid.',
        knowledge: 'You know that touching the orchid’s leaves leaves a luminous yellow pollen residue on bare skin.',
        guilty: false
      },
      {
        name: 'Kamran',
        profession: 'Conservatory Night Guard',
        publicIdentity: 'Patrolling the glass pavilions and locking the botanical garden gates.',
        knowledge: 'You confirm that all perimeter gates remained bolted and padlock seals were intact throughout the storm.',
        guilty: false
      },
      {
        name: 'Salwa',
        profession: 'Soil & Mineral Scientist',
        publicIdentity: 'Formulating specialized volcanic nutrient soils for exotic botanical species.',
        knowledge: 'You found grains of rare perlite potting soil scattered near the service potting shed.',
        guilty: false
      },
      {
        name: 'Elie',
        profession: 'Assistant Toxicology Researcher',
        publicIdentity: 'Assisting in laboratory tests on botanical alkaloids and plant enzymes.',
        knowledge: 'You noticed that the diamond glass-cutting tool in the lab kit was missing its protective cap.',
        guilty: false
      },
      {
        name: 'Maysa',
        profession: 'Research Institute Director',
        publicIdentity: 'Supervising the conservatory’s funding, patents, and scientific announcements.',
        knowledge: 'You know that the global patent application for the orchid was scheduled to be filed first thing in the morning.',
        guilty: false
      },
      {
        name: 'Tony',
        profession: 'Facility Maintenance Technician',
        publicIdentity: 'Repairing heating boilers, greenhouse vent motors, and glass panels.',
        knowledge: 'You confirm that the terrarium glass was cut cleanly from the inside, not shattered by storm debris.',
        guilty: false
      },
      {
        name: 'Jamal',
        profession: 'Climate Control Specialist',
        publicIdentity: 'Monitoring automated digital thermostats and humidity sensors in the pavilions.',
        knowledge: 'You detected a sudden humidity drop in Pavilion 3 at 22:15 when the terrarium was breached.',
        guilty: false
      },
      {
        name: 'Yousra',
        profession: 'Assistant Plant Biologist',
        publicIdentity: 'Assisting in watering schedules and leaf tissue sampling.',
        knowledge: 'You saw someone wearing rubber gardening boots rushing toward the service potting shed in the rain.',
        guilty: false
      },
      {
        name: 'Anwar',
        profession: 'Organic Nutrient Manager',
        publicIdentity: 'Mixing organic fertilizers and bio-stimulants in the greenhouse shed.',
        knowledge: 'You found a fresh container of specialized orchid nutrient solution missing from the supply shelf.',
        guilty: false
      },
      {
        name: 'Walid',
        profession: 'Chemical Water Pump Tech',
        publicIdentity: 'Inspecting chemical dosing pumps and water filtration tanks.',
        knowledge: 'You confirm that the automated misting schedule was manually overridden from the local pump panel.',
        guilty: false
      },
      {
        name: 'Samah',
        profession: 'Rare Seed Vault Curator',
        publicIdentity: 'Cataloging rare seeds and cryogenic germplasm in the seed bank.',
        knowledge: 'You confirm that the seed vault remained locked and no stored germplasm was disturbed.',
        guilty: false
      }
    ],
    clues: [
      'The terrarium glass was incised cleanly with a diamond-tip glass cutter.',
      'Luminous yellow orchid pollen residue was detected on a pair of rubber work gloves.',
      'A portable humidified flask was prepared in the potting shed before the storm.'
    ],
    wrongVoteHints: [
      'Handling nutrient soils is normal for garden staff; look for the specialized portable flask.',
      'Knowing plant biochemistry is expected of toxicologists; verify who physically entered Pavilion 3.',
      'Focus on who possessed the diamond glass scribe and the misting tool to keep the plant alive.'
    ],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'Terrarium Glass Analysis',
        publicClue: 'The display case shows clean diamond-scribe incisions typical of botanical laboratory tools.',
        description: 'The theft was performed cleanly with professional laboratory tools.',
        discussionPrompt: 'Who had access to botanical diamond glass cutters in the conservatory?'
      },
      {
        roundNumber: 2,
        title: 'Luminous Pollen Swab',
        publicClue: 'Blacklight examination shows glowing pollen dust on the handle of the tool locker in the maintenance bay.',
        description: 'The thief touched their locker immediately after handling the live orchid.',
        discussionPrompt: 'Whose locker matches the glowing pollen traces?'
      },
      {
        roundNumber: 3,
        title: 'Potting Shed Inventory',
        publicClue: 'An empty nutrient spray bottle and specialized perlite soil were left on the potting bench.',
        description: 'The plant was repotted into a portable container.',
        discussionPrompt: 'Who was seen in the potting shed preparing transport containers?'
      }
    ]
  },

  royal_kitchen: {
    title: 'The Royal Feast',
    description: 'During an opulent banquet in a historic palace, a sealed royal decree is stolen from the dessert serving tray before reaching the king.',
    introduction: {
      setting: 'Palace Banquet Hall & Royal Kitchens, alive with bustling servants and glittering aristocrats.',
      situation: 'High-ranking dignitaries and courtiers are attending a grand state dinner in the golden dining hall.',
      incident: 'As the dessert cart passed through the dim service corridor, the sealed royal letter was snatched from the silver cloche.',
      stakes: 'The decree contains orders affecting royal succession. If revealed to the public, civil unrest will follow.',
      objective: 'Interrogate the royal butler, palace chefs, and tasters to identify the thief.'
    },
    solution: `Who is the Culprit?
Faris (Executive Royal Chef), in league with conspirators.

What did they do?
Snatched the royal decree from the cloche while inspecting the dessert cart in the pantry and concealed it inside a hollow bread loaf.

Why did they do it?
To sell the royal succession secrets to a rival noble faction for an immense bounty and royal title.`,
    guiltyPool: [
      {
        name: 'Faris',
        profession: 'Executive Royal Chef',
        publicIdentity: 'Directing the entire culinary team and supervising every royal dish leaving the kitchen.',
        knowledge: 'You hid the sealed royal letter inside a hollow crust of artisanal sourdough bread in the pantry.',
        guilty: true
      },
      {
        name: 'Dorra',
        profession: 'Master Pastry Chef',
        publicIdentity: 'Creating exquisite spun-sugar sculptures and delicate royal pastries.',
        knowledge: 'You prepared the silver dessert tray and know the exact order in which dishes were served to the royal table.',
        guilty: true
      },
      {
        name: 'Nabil',
        profession: 'Royal Dining Hall Footman',
        publicIdentity: 'Carrying silver platters and serving wine to the royal high table.',
        knowledge: 'You intentionally delayed pushing the dessert cart through the dark service corridor for ninety seconds.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'Sultana',
        profession: 'Banquet Coordinator',
        publicIdentity: 'Orchestrating banquet protocol, table seating, and service choreography.',
        knowledge: 'You know that the royal decree was resting on the silver cloche when the cart departed the main kitchen.',
        guilty: false
      },
      {
        name: 'Aziza',
        profession: 'Royal Court Musician',
        publicIdentity: 'Playing lute melodies on the grand banquet gallery overlooking the hall.',
        knowledge: 'You saw a palace servant hurriedly ducking into the private pantry with an envelope during the violin solo.',
        guilty: false
      },
      {
        name: 'Murad',
        profession: 'Royal House Historian',
        publicIdentity: 'Documenting the banquet speeches and royal proclamations for palace archives.',
        knowledge: 'You know that the contents of the decree would strip titles from several influential culinary suppliers.',
        guilty: false
      },
      {
        name: 'Warda',
        profession: 'Assistant Pastry Chef',
        publicIdentity: 'Assisting in garnishing royal dessert platters with spun gold and berries.',
        knowledge: 'You noticed that the sealing wax on the royal envelope left a red mark on the chef’s prep table.',
        guilty: false
      },
      {
        name: 'Ihsan',
        profession: 'Appetizer & Hors d’Oeuvres Chef',
        publicIdentity: 'Plating savoury canapés and tasting sauces in the hot kitchen.',
        knowledge: 'You confirm that all kitchen knives and carving tools were accounted for in the knife block.',
        guilty: false
      },
      {
        name: 'Lubna',
        profession: 'Grand Hall Attendant',
        publicIdentity: 'Opening double doors for service carts entering the banquet ballroom.',
        knowledge: 'You noticed that the dessert cloche was slightly ajar when the cart arrived at the ballroom doors.',
        guilty: false
      },
      {
        name: 'Tahseen',
        profession: 'Royal Wine Steward',
        publicIdentity: 'Decanting vintage royal wines and presenting silver goblets.',
        knowledge: 'You saw someone in chef whites carrying a fresh loaf of bread out toward the pantry storage racks.',
        guilty: false
      },
      {
        name: 'Buthaina',
        profession: 'Silverware & Tableware Custodian',
        publicIdentity: 'Polishing royal silver cloches, platters, and gold chalices.',
        knowledge: 'You found red royal sealing wax chips caught under the rim of the dessert cloche.',
        guilty: false
      },
      {
        name: 'Azmi',
        profession: 'Royal Pantry Guard',
        publicIdentity: 'Standing guard at the entrance to the royal pantry storage.',
        knowledge: 'You confirm that no exterior visitors entered the pantry hallway during the banquet dinner.',
        guilty: false
      },
      {
        name: 'Fouad',
        profession: 'Rotisserie & Roast Chef',
        publicIdentity: 'Roasting meats and game birds over the grand kitchen hearth.',
        knowledge: 'You saw Chef Faris inspecting the dessert cart personally right before it was pushed into the corridor.',
        guilty: false
      },
      {
        name: 'Samiha',
        profession: 'Protocol & Seating Coordinator',
        publicIdentity: 'Verifying guest invitations and escorting ambassadors to their seats.',
        knowledge: 'You noticed an emissary from a rival faction waiting anxiously near the service courtyard.',
        guilty: false
      }
    ],
    clues: [
      'The silver dessert cloche was opened in the corridor between the kitchen and ballroom.',
      'Red wax fragments matching the royal seal were found on the chef’s pantry bread rack.',
      'The royal decree was rolled and baked inside a hollow artisanal loaf of sourdough.'
    ],
    wrongVoteHints: [
      'Pushing the service cart was the footman’s duty; verify who actually handled the contents under the cloche.',
      'Preparing desserts is the pastry chef’s job; check where the wax seal residue was discovered.',
      'Focus on who had access to the pantry bread racks where the document was concealed.'
    ],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'Corridor Security Report',
        publicClue: 'Wax fragments matching the royal seal were discovered on the floor of the private chef’s pantry.',
        description: 'The letter was handled inside the chef’s service room immediately after the cart passed.',
        discussionPrompt: 'Who had access to the private pantry during the dessert service?'
      },
      {
        roundNumber: 2,
        title: 'Pantry Bread Rack Inspection',
        publicClue: 'A loaf of artisanal bread on the chef’s cooling rack was unusually weighted and contained a hollow center.',
        description: 'The document was hidden inside the pantry bakery supplies.',
        discussionPrompt: 'Who prepared and stored the artisanal bread loaves tonight?'
      },
      {
        roundNumber: 3,
        title: 'Timeline Reconstruction',
        publicClue: 'Kitchen logs confirm the cart paused for sixty seconds directly outside the head chef’s office door.',
        description: 'The theft occurred during this brief sixty-second pause.',
        discussionPrompt: 'Who was standing outside the chef’s office during the cart transit?'
      }
    ]
  },

  gala_toast: {
    title: 'A Final Toast',
    description: 'During an aristocratic gala celebrating a new family testament, the wealthy host is poisoned by a spiked champagne flute. Everyone has a motive, but only one spiked the glass.',
    introduction: {
      setting: 'Ashford Manor - Grand Banquet Ballroom, surrounded by sparkling chandeliers and private estate grounds.',
      situation: 'Billionaire patriarch Murad Al-Sayed has gathered family, business partners, and legal counsel to announce major changes to his estate testament.',
      incident: 'Moments after raising his crystal champagne flute for the honorary toast, Murad collapses in agony from a lethal chemical neurotoxin.',
      stakes: 'The manor gates are sealed by private security. The murderer is in this room and must be caught before evidence is destroyed.',
      objective: 'Interrogate the banquet guests and staff to expose who poisoned Murad’s toast.'
    },
    solution: `Who is the Culprit?
Samia (Family Estate Attorney).

What did she do?
Swapped Murad's cardiovascular medication with a concentrated lethal dose and stirred it into his champagne flute while it sat unattended.

Why did she do it?
She discovered Murad planned to disinherit her and revoke her lucrative estate management rights in the updated testament.

How was the crime committed?
She used the five minutes while Murad was greeting benefactors near the garden doors to slip the poison into his glass on the side table.

Which clues pointed to her?
The heated confrontation witnessed in the back hall, her privileged access to Murad's medical dossier, and an empty prescription vial found in her evening clutch.`,
    guiltyPool: [
      {
        name: 'Samia',
        profession: 'Family Estate Attorney',
        publicIdentity: 'Claims she was in the library reviewing the legal deed papers before the toast.',
        knowledge: 'You slipped a concentrated dose of toxic cardiac medication into Murad’s crystal glass on the credenza.',
        guilty: true
      }
    ],
    innocentPool: [
      {
        name: 'Tariq',
        profession: 'Gala Event Coordinator',
        publicIdentity: 'Managing the banquet schedule, catering staff, and musical program.',
        knowledge: 'You saw Murad place his filled champagne flute on the side credenza while greeting visitors.',
        guilty: false
      },
      {
        name: 'Hind',
        profession: 'Head Sommelier / Server',
        publicIdentity: 'Pouring vintage champagne from the silver bar cart for the honorary toast.',
        knowledge: 'You confirm that all bottles opened from the main ice bucket were untampered and shared by all guests.',
        guilty: false
      },
      {
        name: 'Dr. Kareem',
        profession: 'Personal Family Physician',
        publicIdentity: 'Attempting emergency medical CPR and examining Murad’s symptoms.',
        knowledge: 'You recognized symptoms of severe cardiac glycoside poisoning, matching a massive overdose of Murad’s heart prescription.',
        guilty: false
      },
      {
        name: 'Nabil',
        profession: 'Senior Business Partner',
        publicIdentity: 'Discussing real estate investments near the grand ballroom staircase.',
        knowledge: 'You overheard Murad angrily telling Samia in the corridor that her services would be terminated tomorrow.',
        guilty: false
      },
      {
        name: 'Rima',
        profession: 'Estranged Sister',
        publicIdentity: 'Attending the gala after years of estrangement to reconcile with her brother.',
        knowledge: 'You saw a woman in a formal dark gown lingering beside Murad’s unattended champagne glass on the credenza.',
        guilty: false
      },
      {
        name: 'Mounir',
        profession: 'Murad’s Private Chauffeur',
        publicIdentity: 'Waiting by the entrance foyer with Murad’s travel coats and briefcase.',
        knowledge: 'You delivered Murad’s personal medical lockbox from the car to the manor study earlier today.',
        guilty: false
      },
      {
        name: 'Majda',
        profession: 'Protocol & Ceremony Director',
        publicIdentity: 'Arranging the honorary podium and microphone for Murad’s speech.',
        knowledge: 'You noticed that the credenza where Murad placed his glass was out of direct line of sight from the main stage.',
        guilty: false
      },
      {
        name: 'Waseem',
        profession: 'Chief Financial Accountant',
        publicIdentity: 'Auditing Murad’s philanthropic trusts and estate ledger.',
        knowledge: 'You know that the updated testament transferred all estate management authority to a charitable foundation.',
        guilty: false
      },
      {
        name: 'Ilham',
        profession: 'Murad’s Cousin',
        publicIdentity: 'Mingling with benefactors and family relatives near the fireplace.',
        knowledge: 'You saw Samia hurriedly closing her evening clutch bag after walking away from the side credenza.',
        guilty: false
      },
      {
        name: 'Raef',
        profession: 'Outer Gate Security Guard',
        publicIdentity: 'Stationed at the estate iron gates checking invitation cards.',
        knowledge: 'You confirm that no outside guests entered or left the estate grounds between 20:00 and 21:00.',
        guilty: false
      },
      {
        name: 'Jinar',
        profession: 'Floral & Décor Stylist',
        publicIdentity: 'Arranging floral centerpieces and crystal candleholders around the ballroom.',
        knowledge: 'You found an empty prescription glass dropper in the trash bin near the private library.',
        guilty: false
      }
    ],
    fixedCharacters: [
      {
        name: 'Samia',
        profession: 'Family Estate Attorney',
        publicIdentity: 'Claims she was in the library reviewing legal deed papers before the toast.',
        knowledge: 'You slipped a concentrated dose of toxic cardiac medication into Murad’s crystal glass on the credenza.',
        guilty: true
      },
      {
        name: 'Hind',
        profession: 'Head Sommelier / Server',
        publicIdentity: 'Pouring vintage champagne from the silver bar cart for the honorary toast.',
        knowledge: 'You confirm that all bottles opened from the main ice bucket were untampered and shared by all guests.',
        guilty: false
      },
      {
        name: 'Dr. Kareem',
        profession: 'Personal Family Physician',
        publicIdentity: 'Attempting emergency medical CPR and examining Murad’s symptoms.',
        knowledge: 'You recognized symptoms of severe cardiac glycoside poisoning, matching a massive overdose of Murad’s heart prescription.',
        guilty: false
      },
      {
        name: 'Nabil',
        profession: 'Senior Business Partner',
        publicIdentity: 'Discussing real estate investments near the grand ballroom staircase.',
        knowledge: 'You overheard Murad angrily telling Samia in the corridor that her services would be terminated tomorrow.',
        guilty: false
      },
      {
        name: 'Rima',
        profession: 'Estranged Sister',
        publicIdentity: 'Attending the gala after years of estrangement to reconcile with her brother.',
        knowledge: 'You saw a woman in a formal dark gown lingering beside Murad’s unattended champagne glass on the credenza.',
        guilty: false
      },
      {
        name: 'Tariq',
        profession: 'Gala Event Coordinator',
        publicIdentity: 'Managing the banquet schedule, catering staff, and musical program.',
        knowledge: 'You saw Murad place his filled champagne flute on the side credenza while greeting visitors.',
        guilty: false
      }
    ],
    clues: [
      'The champagne in Murad’s glass contained a fatal overdose of his own prescribed cardiac medication.',
      'Murad’s glass was left unattended on the credenza between 20:15 and 20:25.',
      'An empty prescription dropper vial was discovered discarded near the private library.'
    ],
    wrongVoteHints: [
      'Pouring the champagne is standard for the sommelier; all bottles in the ice bucket were non-toxic.',
      'Dr. Kareem administered CPR immediately; his medical knowledge is what identified the substance.',
      'Focus on who had access to Murad’s medical file and a motive tied to the updated testament.'
    ],
    investigationRounds: [
      {
        roundNumber: 1,
        title: 'Forensic Toxicology Screen',
        publicClue: 'Toxins in Murad’s glass were identified as a massive overdose of his own prescribed cardiac medication.',
        description: 'The poison was not an exotic substance, but an intentional overdose of prescribed medication.',
        discussionPrompt: 'Who knew about Murad’s medical condition and had access to his prescriptions?'
      },
      {
        roundNumber: 2,
        title: 'Timeline & Glass Placement',
        publicClue: 'Witnesses confirm Murad’s champagne flute sat unattended on the credenza between 20:15 and 20:25.',
        description: 'The poison was added during this precise 10-minute window while the host was occupied.',
        discussionPrompt: 'Where was each guest during the 10 minutes before the toast?'
      },
      {
        roundNumber: 3,
        title: 'Testament Disinheritance Motive',
        publicClue: 'The updated draft testament on Murad’s desk removed legal management power from his longtime attorney.',
        description: 'The murder was executed to prevent the new testament from taking legal effect.',
        discussionPrompt: 'Who stood to lose the most power or fortune if the testament was signed tonight?'
      }
    ]
  }
};
