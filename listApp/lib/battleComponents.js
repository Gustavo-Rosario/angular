angular.module('game')
.component('char', {
  templateUrl: 'components/char.html',
  bindings: {
    player: '='
  }
}).component('battleMenu', {
  templateUrl: 'components/battleMenu.html',
  bindings: {
    player: '=',
    attack: '&',
    items: '&'
  }
}).component('enemyBattle',{
    templateUrl: 'components/enemy.html',
    bindings:{
        enemy: '=',
        turn: '='
    }
}).component('bag',{
    templateUrl: 'components/bag.html',
    bindings:{
        items: '='
    }
});