'use strict';

angular.module('sugarlandDoctorsApp')
  .controller('DoctorsCtrl', function ($scope,$state,$stateParams,page) {
    $scope.doctorId = 0;
    //by default select top 1, if the root speciality is selected.
    if(!$state.params.doctorId){
    	$state.params.doctorId = 12;
    	$state.go( $state.current.data.speciality+'.detail', $state.params);
    }

    $scope.doctors = [];
    $scope.specialists = ["Dentist","ENT","Family Physician","Optometrist","OBGNA"];
    $scope.gender = "both";

    for (var i = 25; i >= 0; i--) {
      $scope.doctors.push({"name":"John Smith", "degrees":["DC","DDC"], "likes":23,"views":120,"category_labels":[["Healthcare","Chiropractors"]],"picture":"/assets/images/thumbnail.jpeg"});
    };

    $scope.$on("$stateChangeSuccess", function updatePage() {
        //update page title
        $scope.doctorId = $state.params.doctorId;
        $scope.speciality = $state.current.data.speciality;// + ' ' + $state.params.doctorId;
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

        page.setTitle('Sugar Land ' + ' ' + $scope.doctor.category_labels[0][1] + ' ' + $scope.doctor.name )

    });
  });
