'use strict';
//var _$stateProviderRef = null;

angular.module('sugarlandDoctorsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.alert',
  'ui.bootstrap.typeahead',
  'ui.bootstrap.carousel',
  'ui.bootstrap.datepicker',
  'ui.bootstrap.buttons',
  'angularPayments',
  'ngImgCrop',
  'nya.bootstrap.select',
  'ngAnimate',
  'jcs-autoValidate',
  'angularFileUpload',
  'ez.timepicker',
  'angular.morris-chart',
  'ngAria',
  'ngMaterial'
])

  .constant('isMobileRequest', !!(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))return true})(navigator.userAgent||navigator.vendor||window.opera))

  .factory('preloadDataset', function() {
    var specialists = [{"name":"Addiction Medicine","url":"addiction-medicine","description":"Specialists in addiction medicine treat substance abuse and addiction."},{"name":"Allergy/Immunology","url":"allergy-immunology","description":"Specialists in allergy and immunology treat conditions that involve the immune system. Examples include allergies, immune deficiency diseases, and autoimmune diseases."},{"name":"Anesthesiology","url":"anesthesiology","description":"Anesthesiologists provide anesthesia for patients who are having surgery or other procedures. They also treat pain and care for patients with critical illnesses or severe injuries."},{"name":"Cardiac Electrophysiology","url":"cardiac-electrophysiology","description":"Cardiac electrophysiologists use technical procedures to evaluate heart rhythms."},{"name":"Cardiology","url":"cardiology","description":"Cardiologists treat diseases of the heart and blood vessels."},{"name":"Chiropractic","url":"chiropractor","description":"Chiropractors adjust specific parts of the body (often the spine) to prevent and treat diseases."},{"name":"Colorectal Surgery","url":"colorectal-surgery","description":"Colorectal surgeons treat diseases of the lower digestive tract."},{"name":"Critical care medicine (intensivists)","url":"intensivists","description":"Intensivists treat critically ill or injured patients."},{"name":"Dentist","url":"dentist","description":""},{"name":"Dermatology","url":"dermatologist","description":"Dermatologists treat skin conditions."},{"name":"Diagnostic radiology","url":"diagnostic-radiology","description":"Diagnostic radiologists use imaging, such as x-rays or ultrasound, to diagnose diseases."},{"name":"Emergency Medicine","url":"emergency-medicine","description":"Emergency medicine specialists take care of patients with critical illnesses or injuries."},{"name":"Endocrinology","url":"endocrinology","description":"Endocrinologists treat diseases that involve the internal (endocrine) glands. Examples include diabetes and diseases of the thyroid, pituitary, or adrenal glands."},{"name":"Family Practice","url":"family-practice","description":"Family practitioners provide primary care for people of all ages. They treat illnesses, provide preventive care, and coordinate the care provided by other health professionals."},{"name":"General Practice","url":"general-practice","description":"General practitioners provide primary care. They treat illnesses, provide preventive care, and coordinate the care provided by other health professionals."},{"name":"General Surgery","url":"general-surgery","description":"General surgeons take care of patients who may need surgery."},{"name":"Geriatric Medicine","url":"geriatric-medicine","description":"Geriatricians provide primary care for elderly patients."},{"name":"Gynecological Oncology","url":"gynecological-oncology","description":"Gynecological oncologists treat cancers of the female reproductive organs."},{"name":"Hand Surgery","url":"hand-surgery","description":"Hand surgeons perform surgery for patients with problems that affect the hand, wrist, or forearm."},{"name":"Hematology","url":"hematology","description":"Hematologists treat diseases of the blood, spleen, and lymph. Examples include anemia, sickle cell disease, hemophilia, and leukemia."},{"name":"Hospice and palliative care","url":"hospice-palliative-care","description":"Hospice - Opens in a new window  and palliative care physicians manage pain and other distressing symptoms of serious illnesses. â€œHospice careâ€ is palliative care for patients who are expected to have 6 months or less to live."},{"name":"Infectious Disease","url":"infectious-disease","description":"Infectious disease physicians treat patients with all types of infectious diseases."},{"name":"Internal Medicine","url":"internal-medicine","description":"Internists treat diseases of the internal organs that donâ€™t require surgery. They also provide primary care for teenagers, adults, and elderly people."},{"name":"Interventional Cardiology","url":"interventional-cardiology","description":"Interventional cardiologists are heart and circulatory system specialists who use minimally invasive catheterization techniques to diagnose and treat coronary arteries, the peripheral vascular system, heart valves, and congenital heart defects."},{"name":"Interventional Pain Management","url":"interventional-pain-management","description":"Interventional pain management specialists use special procedures to treat and manage pain. For example, they may use cryoablation (a procedure involving extreme cold) to stop a nerve from working for a long period of time."},{"name":"Interventional Radiology","url":"interventional-radiology","description":"Interventional radiologists perform procedures guided by various types of imaging. For example, they may use imaging to find a clogged spot in an artery and to guide a procedure to unclog it."},{"name":"Maxillofacial Surgery","url":"maxillofacial-surgery","description":"Maxillofacial surgeons perform surgery on the teeth, jaws, and surrounding tissues."},{"name":"Medical Oncology","url":"medical-oncology","description":"Medical oncologists treat cancer with chemotherapy, hormonal therapy, biological therapy, and targeted therapy. They may also coordinate cancer care given by other specialists."},{"name":"Nephrology","url":"nephrology","description":"Nephrologists treat disorders of the kidneys."},{"name":"Neurologist","url":"neurologist","description":"Neurologists treat diseases of the brain, spinal cord, and nerves."},{"name":"Neuropsychiatry","url":"neuropsychiatry","description":"Neuropsychiatrists treat patients with behavioral disturbances related to nervous system problems."},{"name":"Neurosurgery","url":"neurosurgery","description":"Neurosurgeons perform surgery to treat problems in the brain, spine, and nerves."},{"name":"Nuclear Medicine","url":"nuclear-medicine","description":"Nuclear medicine specialists use radioactive materials to diagnose and treat diseases."},{"name":"Obstetrics Gynecology (OB/GYN)","url":"obgyn","description":"Obstetricians and gynecologists take care of women during pregnancy and childbirth (called obstetrics). They also treat disorders of the female reproductive system (called gynecology)."},{"name":"Ophthalmology","url":"ophthalmology","description":"Ophthalmologists are physicians who specialize in the care of the eyes. They prescribe glasses and contact lenses, diagnose and treat eye conditions, and perform eye surgery."},{"name":"Optometry","url":"optometrist","description":"Optometrists are eye care professionals who perform eye examinations, prescribe corrective lenses, and treat some eye diseases that donâ€™t require surgery."},{"name":"Oral Surgery","url":"oral-surgery","description":"Oral surgeons are dentists who use surgery to treat problems in the mouth and nearby areas."},{"name":"Orthopedic","url":"orthopedist","description":"Orthopedic surgeons treat diseases, injuries, and deformities of the bones and muscles."},{"name":"Osteopathic","url":"osteopathic","description":"Osteopathic physicians often use a treatment method called osteopathic manipulative treatment. This is a hands-on approach to make sure that the body is moving freely."},{"name":"Otolaryngology","url":"otolaryngology","description":"Otolaryngologists treat conditions of the ears, nose, and throat (ENT) and related areas of the head and neck."},{"name":"Pain Management","url":"pain-management","description":"Pain management specialists take care of patients with pain."},{"name":"Pathology","url":"pathology","description":"Pathologists examine body tissues and interpret laboratory test results."},{"name":"Pediatric","url":"pediatrician","description":"Pediatricians provide primary care for infants, children, and teenagers."},{"name":"Peripheral Vascular Disease","url":"peripheral-vascular-disease","description":"Peripheral vascular disease physicians treat diseases of the circulatory system other than those of the brain and heart."},{"name":"Physical Medicine and Rehabilitation","url":"physical-medicine-rehabilitation","description":"Physical medicine and rehabilitation specialists are physicians who treat patients with short-term or long-term disabilities."},{"name":"Plastic Surgery","url":"plastic-surgery","description":"Plastic and reconstructive surgeons perform procedures to improve the appearance or function of parts of the body."},{"name":"Podiatry","url":"podiatry","description":"Podiatrists specialize in caring for the foot and treating foot diseases."},{"name":"Preventive Medicine","url":"preventive-medicine","description":"Preventive medicine specialists work to promote the health and well-being of individuals or groups of people."},{"name":"Primary Care","url":"primary-care","description":"Primary care physicians treat illnesses, provide preventive care, and coordinate the care provided by other health professionals. Physicians in family practice, general practice, geriatric medicine, and internal medicine provide primary care."},{"name":"Psychiatry","url":"psychiatry","description":"Psychiatrists treat mental, addictive, and emotional disorders."},{"name":"Psychiatry (Geriatric)","url":"psychiatry-geriatric","description":"Geriatric psychiatrists treat mental and emotional disorders in elderly people."},{"name":"Pulmonary Disease","url":"pulmonary-disease","description":"Pulmonologists treat diseases of the lungs and airways."},{"name":"Radiation Oncology","url":"radiation-oncology","description":"Radiation oncologists use radiation to treat cancer."},{"name":"Rheumatology","url":"rheumatology","description":"Rheumatologists treat problems involving the joints, muscles, bones, and tendons."},{"name":"Sleep Medicine","url":"sleep-medicine","description":"Sleep medicine physicians treat problems related to sleep or the sleep-wake cycle."},{"name":"Sports Medicine","url":"sports-medicine","description":"Sports medicine specialists treat problems related to participation in sports or exercise."},{"name":"Surgical Oncology","url":"surgical-oncology","description":"Surgical oncologists specialize in the surgical diagnosis and treatment of cancer."},{"name":"Thoracic Surgery","url":"thoracic-surgery","description":"Thoracic surgeons treat problems in the chest, including problems affecting the heart, lungs, or windpipe."},{"name":"Urology","url":"urology","description":"Urologists treat problems in the male and female urinary tract and the male reproductive system."},{"name":"Vascular Surgery","url":"vascular-surgery","description":"Vascular surgeons treat diseases of the circulatory system, other than the brain and heart."}];
    var languages = ["Gujurati","Marathi","Lahnda","Afrikaans", "Arabic", "Azerbaijani", "Catalan", "German", "English", "Spanish", "Persian", "Armenian", "Albanian", "Bulgarian", "Bengali", "Bosnian", "French", "Burmese", "Bokmål", "Dutch", "Portuguese", "Czech", "Greek", "Croatian", "Haitian Creole", "Swahili", "Uyghur", "Chinese", "Danish", "Faroese", "Estonian", "Finnish", "Galician", "Guarani", "Georgian", "Ossetian", "Hebrew", "Hindi", "Hungarian", "Irish", "Indonesian", "Icelandic", "Italian", "Javanese", "Kannada", "Punjabi", "Sanskrit", "Sardinian", "Sundanese", "Tamil", "Telugu", "Urdu", "Japanese", "Kazakh", "Korean", "Luxembourgish", "Limburgish", "Lao", "Lithuanian", "Latvian", "Sinhala", "Malagasy", "Malay", "Maltese", "Nepali", "Nynorsk", "Norwegian", "Polish", "Sindhi", "Romanian", "Russian", "Slovak", "Slovenian", "Somali", "Serbian", "Swedish", "Tajik", "Thai", "Turkish", "Ukrainian", "Uzbek", "Vietnamese", "Welsh"];
    var insurances = ["Aetna", "Blue Cross Blue Shield", "Cigna", "Coventry Health Care", "Humana", "MultiPlan", "UnitedHealthcare", "ODS Health Network", "Medicare", "Great West Healthcare", "Blue Cross", "Met-Life", "Ameritas", "Guardian", "UnitedHealthcare Dental", "DenteMax", "Delta Dental", "United Concordia", "Medicaid", "Principal Financial", "UniCare", "WellPoint", "Scott and White Health Plan", "Health Net", "USA H and W Network", "Evercare", "LA Care Health Plan", "AmeriGroup", "Kaiser Permanente", "HealthNet", "WellCare", "Railroad Medicare", "Regence BlueCross BlueShield ", "Molina", "PacifiCare", "Superior Health Plan", "Centene", "Sierra", "ValueOptions", "Anthem Blue Cross", "Beech Street Corporation", "Private Healthcare Systems", "TriCare", "Highmark Blue Cross Blue Shield", "Anthem", "Boston Medical Center Health Net Plan", "Presbyterian Healthcare Services", "Health First Health Plans", "Medical Universe", "Preferred Provider Organization of Midwest", "Magellan", "Medica Health Plans"];

    var preloadDatasetService = {};
    preloadDatasetService.getSpecialists = function() {
      return specialists;
    };
    preloadDatasetService.getLanguages = function() {
      return languages;
    };
    preloadDatasetService.getInsurances = function() {
      return insurances;
    };

    return preloadDatasetService;
  })

  .factory('mobileHeader', function () {
      var title = 'Sugar Land Doctors';
      return {
          title: function () { return title; },
          setTitle: function(value) { title = value;}
      };
  })

  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, isMobileRequest, $mdThemingProvider) {
    //inject mobile's material design css and js file into the page
    if(isMobileRequest){
      //$mdThemingProvider.theme('default');
      $('link[href$="app.css"]').remove();
      $urlRouterProvider.when("/", "/home");
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "bower_components/font-awesome/css/font-awesome.css";
      document.getElementsByTagName("head")[0].appendChild(link);      

      // var link = document.createElement("link");
      // link.href = "//cdnjs.cloudflare.com/ajax/libs/materialize/0.97.1/css/materialize.min.css";
      // link.type = "text/css";
      // link.rel = "stylesheet";
      // link.media="screen and (max-width : 768px)"
      // document.getElementsByTagName("head")[0].appendChild(link);

      // var script = document.createElement("script");
      // script.type = "text/javascript";
      // script.charset="UTF-8";
      // script.src = "//cdnjs.cloudflare.com/ajax/libs/materialize/0.97.1/js/materialize.min.js";
      // document.getElementsByTagName("head")[0].appendChild(script);

    }

    $urlRouterProvider
      .otherwise("/");
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    Stripe.setPublishableKey('pk_test_VZQrOeMrh2S3F26kwVe9xF5M');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        if ($cookieStore.get('tokend')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('tokend');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/');///login
          // remove any stale tokens
          $cookieStore.remove('token');
          $cookieStore.remove('tokend');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .factory('beforeUnload', function ($rootScope, $window, $cookies, $cookieStore) {
      // Events are broadcast outside the Scope Lifecycle
      angular.forEach($cookies, function(cookie, key){
        if(key.indexOf('view') !== -1){
          $cookieStore.remove(key);
        }
      });
      return {};
  })

  .factory('page', function() {
    var title = 'Sugar Land Doctors';
    var metaDescription = 'Find doctors in Sugar Land area.';
    var metaKeywords = 'Sugar Land';
    return {
      title: function() { return title; },
      setTitle: function(newTitle) { title = newTitle },
      metaDescription: function() { return metaDescription; },
      metaKeywords: function() { return metaKeywords; },
      reset: function() {
        metaDescription = 'Sugar Land Doctors';
        metaKeywords = 'Sugar Land';
      },
      setMetaDescription: function(newMetaDescription) {
        metaDescription = newMetaDescription;
      },
      appendMetaKeywords: function(newKeywords) {
        for (var key in newKeywords) {
          if (metaKeywords === '') {
            metaKeywords += newKeywords[key].name;
          } else {
            metaKeywords += ', ' + newKeywords[key].name;
          }
        }
      }
    };
  })

  .controller('pageTitleCtrl', function($scope, page) {
      $scope.page = page;
  })

  .directive('scroll', function ($window) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
          scope.onResize = function() {
              var scrollHeight = $window.innerHeight - elem[0].getBoundingClientRect().top;;
              elem.css({'height':scrollHeight});
          }

          scope.onResize();

          angular.element($window).bind('resize', function() {
              scope.onResize();
          })
      }
    }
  })

  .run(function ($q, $rootScope, $location, $window, $templateCache, $http, CommonData, Auth, socket, validator, defaultErrorMessageResolver,bootstrap3ElementModifier,beforeUnload) {
      //using this for caching data. Create a service/factory to set/get cache data.
      $rootScope.doctorContact = {};
      $rootScope.conferenceSession = [];
      $http.get('/api/conferences').success(function(activeSessions) {
        $rootScope.conferenceSession = activeSessions;
        socket.syncUpdates('conference', $rootScope.conferenceSession);
      });

      // angular auto validate settings.
      $rootScope.customErrors = {"duplicateEmail":"The specified email address is already in use.",
        "blankEmail":"Email cannot be blank.",
        "blankPassword":"Password cannot be blank.",
        "InvalidEmailOrPassword":"Invalid email or password.",
        "EmailNotFound":"Email not found."};
      bootstrap3ElementModifier.enableValidationStateIcons(true);
      defaultErrorMessageResolver.getErrorMessages().then(function(errorMessages) {
        angular.forEach($rootScope.customErrors, function(value, key){
          errorMessages[key] = value;
        });
        errorMessages["card"] = "Invalid card number.";
        errorMessages["expiry"] = "Invalid expiration date.";
        errorMessages["cvc"] = "Invalid CVC number.";
      });

      $templateCache.put('ez-timepicker.html',
        "<div class=\"dropdown ez-timepicker-container\">\n" +
        "  <div class=\"dropdown-toggle\" ng-class=\"inputContainerClass\">\n" +
        "    <div class=\"time-input\" ng-transclude></div>\n" +
        // "    <span class=\"input-group-btn\">\n" +
        // "      <a class=\"btn btn-default btn-sm\">\n" +
        // "        <i ng-class=\"clockIconClass\"></i>\n" +
        // "      </a>\n" +
        // "    </span>\n" +
        "  </div>\n" +
        "  <div class=\"dropdown-menu\" ng-click=\"preventDefault($event)\">\n" +
        "    <div class=\"hours-col\" ng-class=\"widgetColClass\">\n" +
        "      <div><a class=\"btn\" ng-click=\"incrementHours()\"><i ng-class=\"incIconClass\"></i></a></div>\n" +
        "      <div class=\"hours-val\">{{ widget.hours }}</div>\n" +
        "      <div><a class=\"btn\" ng-click=\"decrementHours()\"><i ng-class=\"decIconClass\"></i></a></div>\n" +
        "    </div>\n" +
        "    <div class=\"minutes-col\" ng-class=\"widgetColClass\">\n" +
        "      <div><a class=\"btn\" ng-click=\"incrementMinutes()\"><i ng-class=\"incIconClass\"></i></a></div>\n" +
        "      <div class=\"minutes-val\">{{ widget.minutes }}</div>\n" +
        "      <div><a class=\"btn\" ng-click=\"decrementMinutes()\"><i ng-class=\"decIconClass\"></i></a></div>\n" +
        "    </div>\n" +
        "    <div class=\"meridian-col\" ng-class=\"widgetColClass\" ng-show=\"showMeridian\">\n" +
        "      <div><a class=\"btn\" ng-click=\"toggleMeridian()\"><i ng-class=\"incIconClass\"></i></a></div>\n" +
        "      <div class=\"meridian-val\" ng-click=\"toggleMeridian()\">{{ widget.meridian }}</div>\n" +
        "      <div><a class=\"btn\" ng-click=\"toggleMeridian()\"><i ng-class=\"decIconClass\"></i></a></div>\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n"
      );

        // '<a>' +
        //     '<img ng-src="{{match.model.profilePicture}}" width="48">' +
        //     '<span bind-html-unsafe="match.model.firstName | typeaheadHighlight:query"></span>' +
        // '</a>'


            // '<div class="col-xs-12 col-sm-3">' +
            //     '<img ng-src="{{match.model.profilePicture}}" alt="{{match.model.firstName}} {{match.model.lastName}}" class="img-responsive img-circle" />' +
            // '</div>' +
            // '<div class="col-xs-12 col-sm-9">' +
            //     '<span class="name">{{match.model.firstName | typeaheadHighlight:query}} {{match.model.lastName  | typeaheadHighlight:query}} {{match.model.credential}}</span><br/>' +
            //     '<span>{{match.model.specialist}}</span><br>' +
            //     '<span> <i class="fa fa-heart" style="color:red;"></i> 23 likes</span>' +
            // '</div>' +
            // '<div class="clearfix"></div>' +

            

      $templateCache.put('auto-complete',
        '<a href="/{{match.model.specialist | lowercase}}/{{match.model.doctorId}}">' +
            '<div class="typeahead" style="clear:none;width:370px;left:515px;">' +
            '<div class="pull-left"><img ng-src="{{match.model.profilePicture}}" alt="{{match.model.firstName}} {{match.model.lastName}}" width="48" height="48" class="img-circle"></div>' +
            '<div class="pull-left margin-small" style="padding-left: 10px;">' +
            '<div class="text-left">{{match.model.firstName}} {{match.model.lastName}} {{match.model.credential}}</div>' +
            '<div class="text-left">{{match.model.specialist}}</div>' +
            '<div class="text-left"> <i class="fa fa-heart" style="color:red;"></i> {{match.model.stats.likes}} likes <i class="fa fa-eye"></i> {{match.model.stats.views}} viwes</div>' +
            '</div>' +
            '<div class="clearfix"></div>' +
            '</div>' +
        '</a>'
        );

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next, current) {
      Auth.isDoctorLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          if(next.name.split(".")[0] === "doctor"){
            $location.path('/signup/doctor/login');
          }
        }
      });

      // Auth.isLoggedInAsync(function(loggedIn) {
      //   if (next.authenticate && !loggedIn) {
      //       $location.path('/login');
      //   }
      // });

    });

    $rootScope.$on("$locationChangeStart",function(event, next, current){
        if (easyrtc.webSocket) {
            easyrtc.disconnect();
        }
    });
  });