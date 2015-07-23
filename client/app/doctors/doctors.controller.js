'use strict';

angular.module('sugarlandDoctorsApp')
  .filter('filterDoctors', function () {
    return function (doctors, search, insurance, gender, language) {
      var filtered = [];
      search = search || '';
      var searchMatch = new RegExp(search, 'i');
      for (var i = 0; i < doctors.length; i++) {
        var doctor = doctors[i];
        var hasGenderMatched = false;
        var hasSearchMatched = false;
        var hasLanguageMatched = false;
        var hasInsuranceMatched = false;

        if(doctor.gender.toLowerCase() === gender.toLowerCase() || gender.toLowerCase() === 'both'){
          hasGenderMatched = true;
        }
        
        if (searchMatch.test(doctor.firstName) || searchMatch.test(doctor.lastName)) {
          hasSearchMatched = true;
        }

        if(_.indexOf(doctor.languages,language) !== -1) {
          hasLanguageMatched = true;
        }

        if(_.indexOf(doctor.insurances,insurance) !== -1){
          hasInsuranceMatched = true;
        }

        if(hasGenderMatched && hasSearchMatched && hasLanguageMatched && (hasInsuranceMatched || insurance === null || typeof insurance === "undefined")){
          filtered.push(doctor);
        }
      }
      return filtered;
    };
  })
  .controller('DoctorsCtrl', function ($rootScope,$scope,$state,$stateParams,page,Auth,Doctor,CommonData) {
    $scope.languages = ["Gujurati","Marathi","Lahnda","Afrikaans", "Arabic", "Azerbaijani", "Catalan", "German", "English", "Spanish", "Persian", "Armenian", "Albanian", "Bulgarian", "Bengali", "Bosnian", "French", "Burmese", "Bokmål", "Dutch", "Portuguese", "Czech", "Greek", "Croatian", "Haitian Creole", "Swahili", "Uyghur", "Chinese", "Danish", "Faroese", "Estonian", "Finnish", "Galician", "Guarani", "Georgian", "Ossetian", "Hebrew", "Hindi", "Hungarian", "Irish", "Indonesian", "Icelandic", "Italian", "Javanese", "Kannada", "Punjabi", "Sanskrit", "Sardinian", "Sundanese", "Tamil", "Telugu", "Urdu", "Japanese", "Kazakh", "Korean", "Luxembourgish", "Limburgish", "Lao", "Lithuanian", "Latvian", "Sinhala", "Malagasy", "Malay", "Maltese", "Nepali", "Nynorsk", "Norwegian", "Polish", "Sindhi", "Romanian", "Russian", "Slovak", "Slovenian", "Somali", "Serbian", "Swedish", "Tajik", "Thai", "Turkish", "Ukrainian", "Uzbek", "Vietnamese", "Welsh"];
    $scope.insurances = ["-Any-","Aetna", "Blue Cross Blue Shield", "Cigna", "Coventry Health Care", "Humana", "MultiPlan", "UnitedHealthcare", "ODS Health Network", "Medicare", "Great West Healthcare", "Blue Cross", "Met-Life", "Ameritas", "Guardian", "UnitedHealthcare Dental", "DenteMax", "Delta Dental", "United Concordia", "Medicaid", "Principal Financial", "UniCare", "WellPoint", "Scott and White Health Plan", "Health Net", "USA H and W Network", "Evercare", "LA Care Health Plan", "AmeriGroup", "Kaiser Permanente", "HealthNet", "WellCare", "Railroad Medicare", "Regence BlueCross BlueShield ", "Molina", "PacifiCare", "Superior Health Plan", "Centene", "Sierra", "ValueOptions", "Anthem Blue Cross", "Beech Street Corporation", "Private Healthcare Systems", "TriCare", "Highmark Blue Cross Blue Shield", "Anthem", "Boston Medical Center Health Net Plan", "Presbyterian Healthcare Services", "Health First Health Plans", "Medical Universe", "Preferred Provider Organization of Midwest", "Magellan", "Medica Health Plans"];
    $scope.doctorId = 0;
    $scope.form = {
        specialist: null,
        gender:"both",
        language:"English",
        insurance: null
    };
    $scope.specialists = $rootScope._specialists;
    $scope.form.specialist = _.find($scope.specialists, function(specialist) {
                                    return specialist.url === $state.current.data.specialist;
                                  });
    $scope.$watch(
        "form.specialist",
        function( newValue, oldValue ) {
            // Ignore initial setup.
            if ( newValue === oldValue ||  $state.current.parent === newValue.url) {
                return;
            }
            $scope.form.specialist = newValue;
            $state.transitionTo($scope.form.specialist.url, $state.params, {
              reload: true, inherit: false, notify: false
            });
            // $state.go($scope.form.specialist.url, $state.params, {
            //   reload: false, inherit: false, notify: false
            // });
            $scope.loadData();
        }
    );

    $scope.loadData = function(){
      //http://localhost:9000/api/doctors/dentist/
      $scope.doctors = [];
      CommonData.listDoctors($scope.form.specialist.url).then( function(data) {
        $scope.doctors = data;
        if($scope.doctors.length > 0){
          $state.params.doctorId = $state.params.doctorId ? $state.params.doctorId : $scope.doctors[0].doctorId;
          // $state.transitionTo($state.current.data.specialist+'.detail', $state.params, {
          //     reload: true, inherit: false, notify: false
          //   });
          $state.go($state.current.data.specialist+'.detail', $state.params, {
              reload: false, inherit: false, notify: false
            });
        }
      }).catch(function(err) {
        debugger;
      });
    }

    $scope.$on("$stateChangeSuccess", function updatePage(e) {
        //update page title
        if($state.current.data.specialist && $state.params.doctorId){
          Doctor.details({id:$state.current.data.specialist,controller:$state.params.doctorId},function(data){
            
          });
        }

        e.preventDefault();

        $scope.doctorId = $state.params.doctorId;
        $scope.doctor = {
                          "address":"3425 Highway 6",
                          "address_extended":"Ste 101",
                          "category_ids":[68],
                          "category_labels":[["Healthcare","Chiropractors"]],
                          "country":"us",
                          "degrees":["DC","DDC"],
                          "factual_id":"384332b6-8922-4433-be51-e39e67c42926",
                          "fax":"(281) 980-138",
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
                          "longitude":-95.60194,
                          "name":"Stephen A. Harris",
                          "neighborhood":["Smada"],
                          "npi_id":"1528075892",
                          "postcode":"77478",
                          "region":"TX",  
                          "tel":"(281) 980-1050",
                          "tel_normalized":"2819801050",
                          "website":"http://www.sugarlandhealthcenter.com",
                          "picture":"/assets/images/thumbnail.jpeg",
                          "bio":"Dr. Stephen A. Harris is an internist in Sugar Land, Texas and is affiliated with multiple hospitals in the area, including OakBend Medical Center and St. Rose Dominican Hospitals - Rose de Lima Campus. He received his medical degree from University of Hawaii John A. Burns School of Medicine and has been in practice for 26 years. He is one of 12 doctors at OakBend Medical Center and one of 116 at St. Rose Dominican Hospitals - Rose de Lima Campus who specialize in Internal Medicine.",
                          "likes":23,
                          "views":120
                        }
          var slides = $scope.slides = [];
          for (var i=0; i<4; i++) {
            var newWidth = 600 + slides.length + 1;
              slides.push({
                image: 'http://placekitten.com/' + newWidth + '/300',
                text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
                  ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
              });
          }

        page.setTitle('Sugar Land ' + ' ' + $scope.doctor.category_labels[0][1] + ' ' + $scope.doctor.name );
    });
      $scope.loadData();
  });
