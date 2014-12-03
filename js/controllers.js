"use strict"
var INTEGER_REGEXP = /^\-?\d+$/;
var emplApp = angular.module('emplApp', ['ngRoute', 'ui.bootstrap', 'ngTouch', 'bootstrap-tagsinput', 'ngTagsInput', 'tagger']);

emplApp
.factory('employeesFactory', function ($http){
    var factory = {};
    var companies = {};
    var employees = {};
    var chosenCompany;

    this.getEmployees = function(){
      $http
        .get('js/data/staff.json')
        .then(function(res){
          employees = res.data;    
        });
    };

    this.getEmployees();

    this.companies = function(){
      return companies;
    };

    this.employees = function(){
      return employees;
    };

    this.addTeam = function(newTeam){
      companies[newTeam] = [];
    };

    this.choseCompany = function(company){
      chosenCompany = company;
    };

    this.getChosenCompany = function(){
      return chosenCompany;
    };

    return this;
})
.controller('leftSideCntr', ['$scope', '$location', 'employeesFactory', function ($scope, $location, employeesFactory) {

  $scope.showComments = function(id){
    if (!$('#comments-' + id).is(':visible')){
      $('#comments-' + id).slideDown(440);
    }else{
      $('#comments-' + id).slideUp(440);
    }
  };

  var tagM = $(".tm-input").tagsManager({
    typeahead: true,
    tagClass: 'newtags',
    replace: true,
    tagsContainer: '#tagField'
  });

  $scope.companies = employeesFactory.companies();
  $scope.employees = employeesFactory.employees();
  $scope.chosenCompany = [];
  
  $(document).off('click', '.tm-tag-remove').on('click', '.tm-tag-remove', function(){
    if($('.tm-tag').length === 0){
      $('#refreshButton').addClass('disabled');
    }
  });


    $scope.onSelect = function ($item, $model, $label) {
      tagM.tagsManager('pushTag', $label);
      /*добавить проверку на наличие класса disabled*/
      $('#refreshButton').removeClass('disabled');
    };

    $scope.addTeam = function(newTeam){
      employeesFactory.addTeam(newTeam);
    };

    $scope.choseCompany = function(company){
      var tagM = $(".tm-input").tagsManager({
        typeahead: true,
        tagClass: 'newtags',
        replace: true,
        tagsContainer: '#tagField'  
      });

      tagM.tagsManager('empty');
      employeesFactory.choseCompany(company);

      $.each( $scope.companies[company], function( key, value ) {
        tagM.tagsManager('pushTag', value.name);
      });
     
      if($scope.companies[company]){
        $('#refreshButton').removeClass('disabled');
      }
    }

    $scope.refresh = function(){
      
      $scope.companies[employeesFactory.getChosenCompany()] = [];

      $('.tm-tag').each(function(){
        var self = this;
        var employees = employeesFactory.employees();

        _.each( employees, function( employee ) {

          if(employee.name == $(self).find('span').html()){

            $scope.companies[employeesFactory.getChosenCompany()].push(employee);

          }
        });
      });
    }

    $scope.changeText = function(newTeam){
      if( !(newTeam === undefined) ){ 
        $('#addTeamButton').removeClass('disabled');
        return true;
      }else{  
        $('#addTeamButton').addClass('disabled');
        return false; 
      }
    };

    $scope.teamNamePattern = (function() {
      var regexp = /^[a-z0-9\s]+$/;
      return {
        test: function(value) {

            if( regexp.test(value) ){ 
            
              $('#addTeamButton').removeClass('disabled');
              return true;
            }
            else{  
            
              $('#addTeamButton').addClass('disabled');
              return false; 
            }
        }
      };
    })();

    $scope.delEmployee = function(employeeName){
      var index;
      
      $.each( $scope.companies[employeesFactory.getChosenCompany()], function( key, value ) {


          if(value.name == employeeName){
            
             index = $scope.companies[employeesFactory.getChosenCompany()].indexOf(value);
             
          }
      });

      $scope.companies[employeesFactory.getChosenCompany()].splice(index, 1);

      angular.element('.tm-tag').each(function(){
        if(angular.element(this).find('span').html() == employeeName){

            angular.element(this).find('a').triggerHandler('click');

        }
      });
    };

    $scope.addFromTableByName = function(employee){

      var alreadyHave = false;
      $.each( $scope.companies[employeesFactory.getChosenCompany()], function( key, value ) {
        
        if(value.name === employee.name){
          alreadyHave = true;
        }
        
      });

      if(!alreadyHave){
        $scope.companies[employeesFactory.getChosenCompany()].push(employee);
      }

    }

    return this;
}])
.controller('ItemController', ['$scope', function (scope) {
  scope.$parent.isopen = (scope.$parent.default === scope.item);
  scope.$watch('isopen', function (newvalue, oldvalue, scope) {
      scope.$parent.isopen = newvalue;
  });
}])
.directive('myPanel', function() {
    return {
      templateUrl: 'js/views/rightPanel.html'
    };
});

emplApp.config(['$routeProvider', function ($routeProvider){
	$routeProvider
    .when('/', {
        templateUrl: 'js/views/tab1.html',
        controller: 'leftSideCntr'
      })
    .when('/home', {
        templateUrl: 'js/views/tab1.html',
        controller: 'leftSideCntr'
      })
    .when('/profile', {
        templateUrl: 'js/views/tab2.html',
        controller: 'leftSideCntr'
      });
}]);