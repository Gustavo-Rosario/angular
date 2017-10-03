const listApp = angular.module('listApp', ['components']);

listApp.controller("FrontCtrl", ["$scope", ($scope, $locale)=>{
    
    let todolist = this;
    
    $scope.date = new Date();
    
    $scope.list = [
        {text: "TCC", done: false},
        {text: "CV", done: false}];
        
    $scope.addTask = ()=>{
        $scope.list.push( {text: $scope.newTask, done: false} );
        $scope.newTask = "";
    }
    
    $scope.rmDone = ()=>{
        $scope.list = $scope.list.filter((item)=>{
            return !item.done; 
        });
    }
    
    $scope.beers = [0, 1, 2, 3, 4, 5, 6];
    $scope.beerForms = {
      0: 'sem breja',
      one: '{} breja',
      other: '{} brejas'
    };
    
}]);