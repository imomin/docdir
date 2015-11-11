'use strict';

angular.module('sugarlandDoctorsApp')
  .config(function ($stateProvider,isMobileRequest) {
  	if(isMobileRequest){
  		var specialists = [{"name":"Addiction Medicine","url":"addiction-medicine","description":"Specialists in addiction medicine treat substance abuse and addiction."},{"name":"Allergy/Immunology","url":"allergy-immunology","description":"Specialists in allergy and immunology treat conditions that involve the immune system. Examples include allergies, immune deficiency diseases, and autoimmune diseases."},{"name":"Anesthesiology","url":"anesthesiology","description":"Anesthesiologists provide anesthesia for patients who are having surgery or other procedures. They also treat pain and care for patients with critical illnesses or severe injuries."},{"name":"Cardiac Electrophysiology","url":"cardiac-electrophysiology","description":"Cardiac electrophysiologists use technical procedures to evaluate heart rhythms."},{"name":"Cardiology","url":"cardiology","description":"Cardiologists treat diseases of the heart and blood vessels."},{"name":"Chiropractic","url":"chiropractor","description":"Chiropractors adjust specific parts of the body (often the spine) to prevent and treat diseases."},{"name":"Colorectal Surgery","url":"colorectal-surgery","description":"Colorectal surgeons treat diseases of the lower digestive tract."},{"name":"Critical care medicine (intensivists)","url":"intensivists","description":"Intensivists treat critically ill or injured patients."},{"name":"Dentist","url":"dentist","description":""},{"name":"Dermatology","url":"dermatologist","description":"Dermatologists treat skin conditions."},{"name":"Diagnostic radiology","url":"diagnostic-radiology","description":"Diagnostic radiologists use imaging, such as x-rays or ultrasound, to diagnose diseases."},{"name":"Emergency Medicine","url":"emergency-medicine","description":"Emergency medicine specialists take care of patients with critical illnesses or injuries."},{"name":"Endocrinology","url":"endocrinology","description":"Endocrinologists treat diseases that involve the internal (endocrine) glands. Examples include diabetes and diseases of the thyroid, pituitary, or adrenal glands."},{"name":"Family Practice","url":"family-practice","description":"Family practitioners provide primary care for people of all ages. They treat illnesses, provide preventive care, and coordinate the care provided by other health professionals."},{"name":"General Practice","url":"general-practice","description":"General practitioners provide primary care. They treat illnesses, provide preventive care, and coordinate the care provided by other health professionals."},{"name":"General Surgery","url":"general-surgery","description":"General surgeons take care of patients who may need surgery."},{"name":"Geriatric Medicine","url":"geriatric-medicine","description":"Geriatricians provide primary care for elderly patients."},{"name":"Gynecological Oncology","url":"gynecological-oncology","description":"Gynecological oncologists treat cancers of the female reproductive organs."},{"name":"Hand Surgery","url":"hand-surgery","description":"Hand surgeons perform surgery for patients with problems that affect the hand, wrist, or forearm."},{"name":"Hematology","url":"hematology","description":"Hematologists treat diseases of the blood, spleen, and lymph. Examples include anemia, sickle cell disease, hemophilia, and leukemia."},{"name":"Hospice and palliative care","url":"hospice-palliative-care","description":"Hospice - Opens in a new window  and palliative care physicians manage pain and other distressing symptoms of serious illnesses. “Hospice care” is palliative care for patients who are expected to have 6 months or less to live."},{"name":"Infectious Disease","url":"infectious-disease","description":"Infectious disease physicians treat patients with all types of infectious diseases."},{"name":"Internal Medicine","url":"internal-medicine","description":"Internists treat diseases of the internal organs that don’t require surgery. They also provide primary care for teenagers, adults, and elderly people."},{"name":"Interventional Cardiology","url":"interventional-cardiology","description":"Interventional cardiologists are heart and circulatory system specialists who use minimally invasive catheterization techniques to diagnose and treat coronary arteries, the peripheral vascular system, heart valves, and congenital heart defects."},{"name":"Interventional Pain Management","url":"interventional-pain-management","description":"Interventional pain management specialists use special procedures to treat and manage pain. For example, they may use cryoablation (a procedure involving extreme cold) to stop a nerve from working for a long period of time."},{"name":"Interventional Radiology","url":"interventional-radiology","description":"Interventional radiologists perform procedures guided by various types of imaging. For example, they may use imaging to find a clogged spot in an artery and to guide a procedure to unclog it."},{"name":"Maxillofacial Surgery","url":"maxillofacial-surgery","description":"Maxillofacial surgeons perform surgery on the teeth, jaws, and surrounding tissues."},{"name":"Medical Oncology","url":"medical-oncology","description":"Medical oncologists treat cancer with chemotherapy, hormonal therapy, biological therapy, and targeted therapy. They may also coordinate cancer care given by other specialists."},{"name":"Nephrology","url":"nephrology","description":"Nephrologists treat disorders of the kidneys."},{"name":"Neurologist","url":"neurologist","description":"Neurologists treat diseases of the brain, spinal cord, and nerves."},{"name":"Neuropsychiatry","url":"neuropsychiatry","description":"Neuropsychiatrists treat patients with behavioral disturbances related to nervous system problems."},{"name":"Neurosurgery","url":"neurosurgery","description":"Neurosurgeons perform surgery to treat problems in the brain, spine, and nerves."},{"name":"Nuclear Medicine","url":"nuclear-medicine","description":"Nuclear medicine specialists use radioactive materials to diagnose and treat diseases."},{"name":"Obstetrics Gynecology (OB/GYN)","url":"obgyn","description":"Obstetricians and gynecologists take care of women during pregnancy and childbirth (called obstetrics). They also treat disorders of the female reproductive system (called gynecology)."},{"name":"Ophthalmology","url":"ophthalmology","description":"Ophthalmologists are physicians who specialize in the care of the eyes. They prescribe glasses and contact lenses, diagnose and treat eye conditions, and perform eye surgery."},{"name":"Optometry","url":"optometrist","description":"Optometrists are eye care professionals who perform eye examinations, prescribe corrective lenses, and treat some eye diseases that don’t require surgery."},{"name":"Oral Surgery","url":"oral-surgery","description":"Oral surgeons are dentists who use surgery to treat problems in the mouth and nearby areas."},{"name":"Orthopedic","url":"orthopedist","description":"Orthopedic surgeons treat diseases, injuries, and deformities of the bones and muscles."},{"name":"Osteopathic","url":"osteopathic","description":"Osteopathic physicians often use a treatment method called osteopathic manipulative treatment. This is a hands-on approach to make sure that the body is moving freely."},{"name":"Otolaryngology","url":"otolaryngology","description":"Otolaryngologists treat conditions of the ears, nose, and throat (ENT) and related areas of the head and neck."},{"name":"Pain Management","url":"pain-management","description":"Pain management specialists take care of patients with pain."},{"name":"Pathology","url":"pathology","description":"Pathologists examine body tissues and interpret laboratory test results."},{"name":"Pediatric","url":"pediatrician","description":"Pediatricians provide primary care for infants, children, and teenagers."},{"name":"Peripheral Vascular Disease","url":"peripheral-vascular-disease","description":"Peripheral vascular disease physicians treat diseases of the circulatory system other than those of the brain and heart."},{"name":"Physical Medicine and Rehabilitation","url":"physical-medicine-rehabilitation","description":"Physical medicine and rehabilitation specialists are physicians who treat patients with short-term or long-term disabilities."},{"name":"Plastic Surgery","url":"plastic-surgery","description":"Plastic and reconstructive surgeons perform procedures to improve the appearance or function of parts of the body."},{"name":"Podiatry","url":"podiatry","description":"Podiatrists specialize in caring for the foot and treating foot diseases."},{"name":"Preventive Medicine","url":"preventive-medicine","description":"Preventive medicine specialists work to promote the health and well-being of individuals or groups of people."},{"name":"Primary Care","url":"primary-care","description":"Primary care physicians treat illnesses, provide preventive care, and coordinate the care provided by other health professionals. Physicians in family practice, general practice, geriatric medicine, and internal medicine provide primary care."},{"name":"Psychiatry","url":"psychiatry","description":"Psychiatrists treat mental, addictive, and emotional disorders."},{"name":"Psychiatry (Geriatric)","url":"psychiatry-geriatric","description":"Geriatric psychiatrists treat mental and emotional disorders in elderly people."},{"name":"Pulmonary Disease","url":"pulmonary-disease","description":"Pulmonologists treat diseases of the lungs and airways."},{"name":"Radiation Oncology","url":"radiation-oncology","description":"Radiation oncologists use radiation to treat cancer."},{"name":"Rheumatology","url":"rheumatology","description":"Rheumatologists treat problems involving the joints, muscles, bones, and tendons."},{"name":"Sleep Medicine","url":"sleep-medicine","description":"Sleep medicine physicians treat problems related to sleep or the sleep-wake cycle."},{"name":"Sports Medicine","url":"sports-medicine","description":"Sports medicine specialists treat problems related to participation in sports or exercise."},{"name":"Surgical Oncology","url":"surgical-oncology","description":"Surgical oncologists specialize in the surgical diagnosis and treatment of cancer."},{"name":"Thoracic Surgery","url":"thoracic-surgery","description":"Thoracic surgeons treat problems in the chest, including problems affecting the heart, lungs, or windpipe."},{"name":"Urology","url":"urology","description":"Urologists treat problems in the male and female urinary tract and the male reproductive system."},{"name":"Vascular Surgery","url":"vascular-surgery","description":"Vascular surgeons treat diseases of the circulatory system, other than the brain and heart."}];
      	$stateProvider
			.state('main', {
		        url: '/',
		        views: {
		        	'@': {
		        		templateUrl: 'app/mobile/mobile.html',
		        		controller: 'MobileMainCtrl'
		        	}
		        }
		      })
			.state('main.home', {
		        url: 'home',
		        views: {
		        	'content@main': {
		        		templateUrl: 'app/mobile/home.html',
		        		controller: 'MobileMainCtrl'
		        	}
		        }
		      })
			.state('main.login', {
		        url: 'login',
		        views: {
		        	'content@main': {
		        		templateUrl: 'app/mobile/login.html',
		        		controller: 'MobileMainCtrl'
		        	}
		        }
		      })
			.state('main.contactus', {
		        url: 'contactus',
		        views: {
		        	'content@main': {
		        		templateUrl: 'app/mobile/contactus.html',
		        		controller: 'MobileMainCtrl'
		        	}
		        }
		      });
		angular.forEach(specialists, function(list) {
		  var state = list.url;
		  $stateProvider
		    .state('main.'+state, {
		      url:'^/'+ state + '/',
		      views: {
		        'content@main': {
		          templateUrl:'app/mobile/mobile.list.html',
		          controller: 'MobileListCtrl',
		        }
		      },
		      data: {
		        specialist:state,
		        name:list.name
		       }       
		    })
		    .state('main.'+ state + '.detail', {//for mobile, if the request directly comes from google or external link.
		       url: '^/'+ state +'/:doctorId',
		       views: {
				'content@main': {
						templateUrl: 'app/mobile/mobile.details.html',
						controller:'MobileDetailCtrl'
					}
				},
		       data: {
		        specialist:state,
		        name:list.name
		       }
		    });
		});
  	}
  });