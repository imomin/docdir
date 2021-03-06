/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

// var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Specialist = require('../api/specialist/specialist.model');
//http://www.medicare.gov/physiciancompare/staticpages/resources/specialtydefinitions.html
Specialist.find({}).remove(function(){

  Specialist.create(
  {
    "name":"Addiction Medicine",
    "url":"addiction-medicine",
    "description":"Specialists in addiction medicine treat substance abuse and addiction.",
    "active":true
  },
  {
    "name":"Allergy/Immunology",
    "url":"allergy-immunology",
    "description":"Specialists in allergy and immunology treat conditions that involve the immune system. Examples include allergies, immune deficiency diseases, and autoimmune diseases.",
    "active":true},
  {
    "name":"Anesthesiology",
    "url":"anesthesiology",
    "description":"Anesthesiologists provide anesthesia for patients who are having surgery or other procedures. They also treat pain and care for patients with critical illnesses or severe injuries.",
    "active":true},
  {
    "name":"Cardiac Electrophysiology",
    "url":"cardiac-electrophysiology",
    "description":"Cardiac electrophysiologists use technical procedures to evaluate heart rhythms.",
    "active":true},
  {
    "name":"Cardiology",
    "url":"cardiology",
    "description":"Cardiologists treat diseases of the heart and blood vessels.",
    "active":true},
  {
    "name":"Chiropractic",
    "url":"chiropractor",
    "description":"Chiropractors adjust specific parts of the body (often the spine) to prevent and treat diseases.",
    "active":true},
  {
    "name":"Colorectal Surgery",
    "url":"colorectal-surgery",
    "description":"Colorectal surgeons treat diseases of the lower digestive tract.",
    "active":true},
  {
    "name":"Critical care medicine (intensivists)",
    "url":"intensivists",
    "description":"Intensivists treat critically ill or injured patients.",
    "active":true},
    {
    "name":"Dentist",
    "url":"dentist",
    "description":"",
    "active":true},
  {
    "name":"Dermatology",
    "url":"dermatologist",
    "description":"Dermatologists treat skin conditions.",
    "active":true},
  {
    "name":"Diagnostic radiology",
    "url":"diagnostic-radiology",
    "description":"Diagnostic radiologists use imaging, such as x-rays or ultrasound, to diagnose diseases.",
    "active":true},
  {
    "name":"Emergency Medicine",
    "url":"emergency-medicine",
    "description":"Emergency medicine specialists take care of patients with critical illnesses or injuries.",
    "active":true},
  {
    "name":"Endocrinology",
    "url":"endocrinology",
    "description":"Endocrinologists treat diseases that involve the internal (endocrine) glands. Examples include diabetes and diseases of the thyroid, pituitary, or adrenal glands.",
    "active":true},
  {
    "name":"Family Practice",
    "url":"family-practice",
    "description":"Family practitioners provide primary care for people of all ages. They treat illnesses, provide preventive care, and coordinate the care provided by other health professionals.",
    "active":true},
  {
    "name":"Gastroenterology",
    "url":"",
    "description":"Gastroenterologists treat diseases of the digestive organs, including the stomach, bowels, liver, and gallbladder.",
    "active":true},
  {
    "name":"General Practice",
    "url":"general-practice",
    "description":"General practitioners provide primary care. They treat illnesses, provide preventive care, and coordinate the care provided by other health professionals.",
    "active":true},
  {
    "name":"General Surgery",
    "url":"general-surgery",
    "description":"General surgeons take care of patients who may need surgery.",
    "active":true},
  {
    "name":"Geriatric Medicine",
    "url":"geriatric-medicine",
    "description":"Geriatricians provide primary care for elderly patients.",
    "active":true},
  {
    "name":"Gynecological Oncology",
    "url":"gynecological-oncology",
    "description":"Gynecological oncologists treat cancers of the female reproductive organs.",
    "active":true},
  {
    "name":"Hand Surgery",
    "url":"hand-surgery",
    "description":"Hand surgeons perform surgery for patients with problems that affect the hand, wrist, or forearm.",
    "active":true},
  {
    "name":"Hematology",
    "url":"hematology",
    "description":"Hematologists treat diseases of the blood, spleen, and lymph. Examples include anemia, sickle cell disease, hemophilia, and leukemia.",
    "active":true},
  {
    "name":"Hospice and palliative care",
    "url":"hospice-palliative-care",
    "description":"Hospice - Opens in a new window  and palliative care physicians manage pain and other distressing symptoms of serious illnesses. “Hospice care” is palliative care for patients who are expected to have 6 months or less to live.",
    "active":true},
  {
    "name":"Infectious Disease",
    "url":"infectious-disease",
    "description":"Infectious disease physicians treat patients with all types of infectious diseases.",
    "active":true},
  {
    "name":"Internal Medicine",
    "url":"internal-medicine",
    "description":"Internists treat diseases of the internal organs that don’t require surgery. They also provide primary care for teenagers, adults, and elderly people.",
    "active":true},
  {
    "name":"Interventional Cardiology",
    "url":"interventional-cardiology",
    "description":"Interventional cardiologists are heart and circulatory system specialists who use minimally invasive catheterization techniques to diagnose and treat coronary arteries, the peripheral vascular system, heart valves, and congenital heart defects.",
    "active":true},
  {
    "name":"Interventional Pain Management",
    "url":"interventional-pain-management",
    "description":"Interventional pain management specialists use special procedures to treat and manage pain. For example, they may use cryoablation (a procedure involving extreme cold) to stop a nerve from working for a long period of time.",
    "active":true},
  {
    "name":"Interventional Radiology",
    "url":"interventional-radiology",
    "description":"Interventional radiologists perform procedures guided by various types of imaging. For example, they may use imaging to find a clogged spot in an artery and to guide a procedure to unclog it.",
    "active":true},
  {
    "name":"Maxillofacial Surgery",
    "url":"maxillofacial-surgery",
    "description":"Maxillofacial surgeons perform surgery on the teeth, jaws, and surrounding tissues.",
    "active":true},
  {
    "name":"Medical Oncology",
    "url":"medical-oncology",
    "description":"Medical oncologists treat cancer with chemotherapy, hormonal therapy, biological therapy, and targeted therapy. They may also coordinate cancer care given by other specialists.",
    "active":true},
  {
    "name":"Nephrology",
    "url":"nephrology",
    "description":"Nephrologists treat disorders of the kidneys.",
    "active":true},
  {
    "name":"Neurologist",
    "url":"neurologist",
    "description":"Neurologists treat diseases of the brain, spinal cord, and nerves.",
    "active":true},
  {
    "name":"Neuropsychiatry",
    "url":"neuropsychiatry",
    "description":"Neuropsychiatrists treat patients with behavioral disturbances related to nervous system problems.",
    "active":true},
  {
    "name":"Neurosurgery",
    "url":"neurosurgery",
    "description":"Neurosurgeons perform surgery to treat problems in the brain, spine, and nerves.",
    "active":true},
  {
    "name":"Nuclear Medicine",
    "url":"nuclear-medicine",
    "description":"Nuclear medicine specialists use radioactive materials to diagnose and treat diseases.",
    "active":true},
  {
    "name":"Obstetrics Gynecology (OB/GYN)",
    "url":"obgyn",
    "description":"Obstetricians and gynecologists take care of women during pregnancy and childbirth (called obstetrics). They also treat disorders of the female reproductive system (called gynecology).",
    "active":true},
  {
    "name":"Ophthalmology",
    "url":"ophthalmology",
    "description":"Ophthalmologists are physicians who specialize in the care of the eyes. They prescribe glasses and contact lenses, diagnose and treat eye conditions, and perform eye surgery.",
    "active":true},
  {
    "name":"Optometry",
    "url":"optometrist",
    "description":"Optometrists are eye care professionals who perform eye examinations, prescribe corrective lenses, and treat some eye diseases that don’t require surgery.",
    "active":true},
  {
    "name":"Oral Surgery",
    "url":"oral-surgery",
    "description":"Oral surgeons are dentists who use surgery to treat problems in the mouth and nearby areas.",
    "active":true},
  {
    "name":"Orthopedic",
    "url":"orthopedist",
    "description":"Orthopedic surgeons treat diseases, injuries, and deformities of the bones and muscles.",
    "active":true},
  {
    "name":"Osteopathic",
    "url":"osteopathic",
    "description":"Osteopathic physicians often use a treatment method called osteopathic manipulative treatment. This is a hands-on approach to make sure that the body is moving freely.",
    "active":true},
  {
    "name":"Otolaryngology",
    "url":"otolaryngology",
    "description":"Otolaryngologists treat conditions of the ears, nose, and throat (ENT) and related areas of the head and neck.",
    "active":true},
  {
    "name":"Pain Management",
    "url":"pain-management",
    "description":"Pain management specialists take care of patients with pain.",
    "active":true},
  {
    "name":"Pathology",
    "url":"pathology",
    "description":"Pathologists examine body tissues and interpret laboratory test results.",
    "active":true},
  {
    "name":"Pediatric",
    "url":"pediatrician",
    "description":"Pediatricians provide primary care for infants, children, and teenagers.",
    "active":true},
  {
    "name":"Peripheral Vascular Disease",
    "url":"peripheral-vascular-disease",
    "description":"Peripheral vascular disease physicians treat diseases of the circulatory system other than those of the brain and heart.",
    "active":true},
  {
    "name":"Physical Medicine and Rehabilitation",
    "url":"physical-medicine-rehabilitation",
    "description":"Physical medicine and rehabilitation specialists are physicians who treat patients with short-term or long-term disabilities.",
    "active":true},
  {
    "name":"Plastic Surgery",
    "url":"plastic-surgery",
    "description":"Plastic and reconstructive surgeons perform procedures to improve the appearance or function of parts of the body.",
    "active":true},
  {
    "name":"Podiatry",
    "url":"podiatry",
    "description":"Podiatrists specialize in caring for the foot and treating foot diseases.",
    "active":true},
  {
    "name":"Preventive Medicine",
    "url":"preventive-medicine",
    "description":"Preventive medicine specialists work to promote the health and well-being of individuals or groups of people.",
    "active":true},
  {
    "name":"Primary Care",
    "url":"primary-care",
    "description":"Primary care physicians treat illnesses, provide preventive care, and coordinate the care provided by other health professionals. Physicians in family practice, general practice, geriatric medicine, and internal medicine provide primary care.",
    "active":true},
  {
    "name":"Psychiatry",
    "url":"psychiatry",
    "description":"Psychiatrists treat mental, addictive, and emotional disorders.",
    "active":true
  },
  {
    "name":"Psychiatry (Geriatric)",
    "url":"psychiatry-geriatric",
    "description":"Geriatric psychiatrists treat mental and emotional disorders in elderly people.",
    "active":true
  },
  {
    "name":"Pulmonary Disease",
    "url":"pulmonary-disease",
    "description":"Pulmonologists treat diseases of the lungs and airways.",
    "active":true
  },
  {
    "name":"Radiation Oncology",
    "url":"radiation-oncology",
    "description":"Radiation oncologists use radiation to treat cancer.",
    "active":true
  },
  {
    "name":"Rheumatology",
    "url":"rheumatology",
    "description":"Rheumatologists treat problems involving the joints, muscles, bones, and tendons.",
    "active":true
  },
  {
    "name":"Sleep Medicine",
    "url":"sleep-medicine",
    "description":"Sleep medicine physicians treat problems related to sleep or the sleep-wake cycle.",
    "active":true
  },
  {
    "name":"Sports Medicine",
    "url":"sports-medicine",
    "description":"Sports medicine specialists treat problems related to participation in sports or exercise.",
    "active":true
  },
  {
    "name":"Surgical Oncology",
    "url":"surgical-oncology",
    "description":"Surgical oncologists specialize in the surgical diagnosis and treatment of cancer.",
    "active":true
  },
  {
    "name":"Thoracic Surgery",
    "url":"thoracic-surgery",
    "description":"Thoracic surgeons treat problems in the chest, including problems affecting the heart, lungs, or windpipe.",
    "active":true
  },
  {
    "name":"Urology",
    "url":"urology",
    "description":"Urologists treat problems in the male and female urinary tract and the male reproductive system.",
    "active":true
  },
  {
    "name":"Vascular Surgery",
    "url":"vascular-surgery",
    "description":"Vascular surgeons treat diseases of the circulatory system, other than the brain and heart.",
    "active":true
  });
});

// Thing.find({}).remove(function() {
//   Thing.create({
//     name : 'Development Tools',
//     info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
//   }, {
//     name : 'Server and Client integration',
//     info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
//   }, {
//     name : 'Smart Build System',
//     info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
//   },  {
//     name : 'Modular Structure',
//     info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
//   },  {
//     name : 'Optimized Build',
//     info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
//   },{
//     name : 'Deployment Ready',
//     info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
//   });
// });

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});

//https://data.medicare.gov/data/physician-compare
//https://data.medicare.gov/Physician-Compare/National-Downloadable-File-Simplified-View/jcud-62jk
//http://www.bloomapi.com/api/npis/##############
/*
{
  "address":"3425 Highway 6",
  "address_extended":"Ste 101",
  "category_ids":[68],
  "category_labels":[["Healthcare","Chiropractors"]],
  "country":"us",
  "degrees":["DC"],
  "factual_id":"384332b6-8922-4433-be51-e39e67c42926",
  "fax":"(281) 980-1348",
  "gender":"Male",
  "hours":{
    "monday":[["9:00","18:00"]],
    "tuesday":[["9:00","18:00"]],
    "wednesday":[["9:00","18:00"]],
    "thursday":[["9:00","18:00"]],
    "friday":[["9:00","12:00"]]
  },
  "hours_display":"Mon-Thu 9:00 AM-6:00 PM; Fri 9:00 AM-12:00 PM",
  "insurances":["Aetna","Blue Cross Blue Shield","Cigna","Coventry Health Care","Humana","MultiPlan","UnitedHealthcare"],
  "languages":["English"],
  "latitude":29.591304,
  "locality":"Sugar Land",
  "longitude":-95.60194,"
  name":"Stephen A. Harris",
  "neighborhood":["Smada"],
  "npi_id":"1528075892",
  "postcode":"77478",
  "region":"TX",
  "tel":"(281) 980-1050",
  "tel_normalized":"2819801050",
  "website":"http://www.sugarlandhealthcenter.com"
}
*/

// var jsonData = [...]
// distinctArray = [];
// _.each(jsonData,function(item,index){
//   if(item.insurances && _.isArray(item.insurances) && item.insurances.length > 0){
//     distinctArray = _.union(distinctArray,item.insurances);
//   }
// });




