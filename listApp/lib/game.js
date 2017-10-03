const game = angular.module("game", []);

game.controller("gameCtrl",function gameCtrl($scope, $document, $timeout, $interval, Char, Enemy, Item, Potion){
    
    $scope.player = {};
    
    $scope.battle = {};
    
    $scope.battle.log = false;
    
    $scope.battle.enemies = false;
    
    $scope.battle.menu = false;
    
    $scope.logs = [];
    
    $scope.battle.turn = 'wait';
    
    $scope.battle.bag = false;
    
    $scope.battle.enemies = [Enemy.build({
        name: "Slime",
        ds: "Green Slime",
        hand: "r",
        img: "slime.png",
        hp: 20,
        mhp : 20,
        element: "nature",
        stats: { str: 5, res: 5, acc: 90, agi: 20, mag: 5, mres: 5  },
        stam: 15,
        xp: 15,
        item: [null]
    }),
                             Enemy.build({
        name: "Goblin",
        ds: "Blue Goblin",
        hand: "r",
        img: "goblin.png",
        hp: 40,
        mhp : 40,
        element: "water",
        stats: { str: 15, res: 10, acc: 80, agi: 20, mag: 5, mres: 5  },
        stam: 15,
        xp: 10,
        item: [null,Potion.build({name:"Potion",type:"life",num:50})]
    })];
    
    $scope.player.gold = 54952;
    
    $scope.player.team = [Char.build({
        name: "Stephany",
        ds: "the big mom",
        hand: "r",
        img: "ste-char.png",
        imgFolder: { 
            char:"ste-char.png",
            atk: "ste-atk.png",
            dmg: "ste-dmg.png"
        },
        hp: 50,
        mhp : 50,
        element: "water",
        stats: { str: 20, res: 20, acc: 90, agi: 15, mag: 18, mres: 13  },
        stamrec: 11,
        profile: {
            age : 20,
            origin: "the guarucity",
            height: 1.65,
            weight: "??",
            build: "muscular"
        },
        lvl: { lvl: 1, xp: 0, next: 20 }
    }),
                          Char.build({
        name: "Brenda",
        ds: "the dino lover",
        hand: "l",
        img: "bren-char.png",
        imgFolder: { 
            char:"bren-char.png",
            atk: "bren-atk.png",
            dmg: "bren-dmg.png"
        },
        hp: 70,
        mhp : 70,
        element: "fire",
        stats: { str: 25, res: 30, acc: 90, agi: 10, mag: 10, mres: 20  },
        stamrec: 11,
        profile: {
            age : 19,
            origin: "the guarucity",
            height: 1.70,
            weight: "??",
            build: "Mind"
        },
        lvl: { lvl: 1, xp: 0, next: 20 }
    }),
                          Char.build({
        name: "Dart",
        ds: "Special Dog",
        hand: "r",
        img: "dart-char.png",
        hp: 30,
        mhp : 30,
        element: "nature",
        stats: { str: 50, res: 10, acc: 90, agi: 20, mag: 5, mres: 5  },
        stamrec: 15,
        profile: {
            age : 2,
            origin: "Elder PG",
            height: 0.80,
            weight: "30kg",
            build: "Bite"
        },
        lvl: { lvl: 1, xp: 0, next: 20 }
    })];
    
    $scope.showMenu = (partner)=>{
        $scope.setPlayer(partner);
        $scope.battle.menu = true;
    };
    
    $scope.showEnemies = ()=>{
        $scope.battle.log = "Select an enemey";
        $scope.battle.turn = 'attack';
    };
    
    $scope.hideEnemies = ()=>{
        $scope.battle.enemies = false;
    };
    
    $scope.setPlayer = (char)=>{
        $scope.player.char = char;
    };
    
    //Attack menu
    $scope.attack = (char, enemy)=>{
        let response = char.atkFS(enemy);
        
        $scope.logs.push( char.name + " attack " + enemy.name + " "
            + response.data + ((response.data != "miss")? "Dmg: " + response.dmg : "") );
        
        if(response.dead){
            if(response.reward.item != null){
                $scope.logs.push(enemy.name + " dropped: " + response.reward.item.name);
            }
            $scope.logs.push(char.name + " receive " + response.reward.xp + "xp");
        }        
        $scope.showlogs();
        $scope.battle.menu = false;
        $scope.battle.turn = 'wait';
    };
    
    // Charge action bar
    $scope.player.charge = function charge(){
        
        $scope.player.team.forEach(function(char){
            if(char.sta < 100){
                char.sta = ((char.sta + char.stamrec >= 100)? 100 : char.sta + char.stamrec);
            }
        });
        
        $timeout( charge , 500 );    

    };
    
    $scope.isValid= (attr)=>{
        return (attr != false);
    };

    $scope.openBag = ()=>{
        $scope.battle.bag = true;  
    };
    
    $scope.num = 0;
    //Message of Battle
    $scope.showlogs = function logs() {
        $scope.battle.log = $scope.logs[$scope.num];
        if ($scope.num == $scope.logs.length ) {
            $scope.logs = [];
            $scope.battle.log = false;
            $scope.num = 0;
            return;
        } else {
        	$scope.num++ ;
        }
        $timeout(logs, 2000);
    };
    
});

game.factory('Char', ()=>{
    /**
    * Constructor, with class name
    */
    
    function Char(name,ds,hand,img,imgFolder,hp,mhp,element,stats,stamrec,profile,lvl) {
        // Public properties, assigned to the instance ('$this')
        this.name = name;
        this.ds = ds;
        this.hand = hand;
        this.img = img;
        this.imgFolder = imgFolder;
        this.hp = hp;
        this.mhp = mhp;
        this.element = element;
        this.stats = stats;
        this.stamrec = stamrec;
        this.profile = profile;
        this.lvl = lvl;
        this.bag = [];        
        this.sta = 0;
    }

    /**
    * Public method, assigned to prototype
    */
    
    Char.prototype.getSta = function(){
        return this.sta;
    }
    
    Char.prototype.getName = function(){
        return this.name;
    };
    Char.prototype.addXp = function(xp){
        this.lvl.xp += xp;
    }
    Char.prototype.dmgF = function(){
        return this.stats.str; 
    };
    
    // ------------------- BATTLE METHODS --------------------- //
    
    // Fisical Attack
    Char.prototype.atkFS = function($target){
        var $this = this;
        let num = Math.floor(Math.random() * $this.stats.acc) + 1;
        let result = {};
        $this.img = $this.imgFolder.atk;
        $this.status = "attack";
        setTimeout(function(){
            $this.img = $this.imgFolder.char;
            $this.status = false;
        },500);
        //Teste de ataque
        if(num <= ($this.stats.acc*0.15) ){ //15% da precisao
            //Miss
            result.data = "miss";
        }else if(num >= $this.stats.acc*0.85){ //ultimos 15%
            //Critic
            result.dmg = $target.dmg( $this.dmgF() * 2 ).dmg;
            result.data = "critical";
        }else{
            //Regular
            result.dmg =$target.dmg( $this.dmgF() ).dmg;
            result.data = "normal";
        }
        
        if(!$target.isAlive()){
            $this.addXp( $target.giveXp() );
            var item = $target.drop();
            //Checa se recebeu item
            result.dead = true;
            result.reward = { xp: $target.giveXp(), item: item }
            if(item != null ) {
                this.takeItem(item);
            }
            this.lvlUp();
        }
        $this.sta = 0;
        
        return result;
    };
    // Take Damage
    Char.prototype.dmg = (dmg)=>{
        let dmgTotal = ( dmg * (1 - ( $this.stats.res / 1000 ) ) );
        let hp = (($this.hp - dmgTotal) < 0)? 0 : Math.round($this.hp - dmgTotal);
        $this.hp = hp;
        return {data: "success"};
    };
    // Check if the character is Alive
    Char.prototype.isAlive = ()=>{
        return $this.hp > 0;
    };
    // Add an item to Bag
    Char.prototype.takeItem = function($item){
        this.bag.push( $item );
        let key = this.bag.length - 1;
        $item.bagkey = key;
        return { data:"success", itemName: $item.name };
    };
    
    Char.prototype.lvlUp = function(){
        let result;
        var $this = this;
        if($this.lvl.xp >= $this.lvl.next){
            $this.lvl.lvl ++;
            $this.lvl.next = Math.round($this.lvl.next * 2.25);
            $this.mhp = Math.round($this.mhp * 1.20);
            $this.stats.str = Math.round($this.stats.str * 1.20);
            $this.lvlUp();
            result = {data: "up"};
        }else{
            result = {data: "nothing"};
        }
        return result;
    };

    /**
    * Private property
    */
    var possibleRoles = ['admin', 'editor', 'guest'];

    /**
    * Private function
    */
    function checkRole(role) {
        return possibleRoles.indexOf(role) !== -1;
    }

    /**
    * Static property
    * Using copy to prevent modifications to private property
    */
    Char.possibleRoles = angular.copy(possibleRoles);

    /**
    * Static method, assigned to class
    * Instance ('$this') is not available in static context
    */
    Char.build = (data)=> {
        return new Char(
            data.name,
            data.ds,
            data.hand,
            data.img,
            data.imgFolder,
            data.hp,
            data.mhp,
            data.element,
            data.stats,
            data.stamrec,
            data.profile,
            data.lvl
        );
    };

    /**
    * Return the constructor function
    */
    return Char;
})
    .factory('Enemy', ()=>{
    /**
    * Constructor, with class name
    */
    function Enemy(name,ds,hand,img,hp,mhp,element,stats,stamrec,xp, items) {
        // Public properties, assigned to the instance ('this')
        this.name = name;
        this.ds = ds;
        this.hand = hand;
        this.img = img;
        this.hp = hp;
        this.mhp = mhp;
        this.element = element;
        this.stats = stats;
        this.stamrec = stamrec;
        this.xp = xp;
        this.items = items;
    }
    /**
    * Public method, assigned to prototype
    */
    this.item = {};
    
    Enemy.prototype.getName = ()=>{
        return this.name;
    };

    Enemy.prototype.dmgF = ()=>{
        return this.stats.str; 
    };
    
    // ------------------- BATTLE METHODS --------------------- //
    // Fisical Attack
    Enemy.prototype.atkFS = function($target){
        let num = Math.floor(Math.random() * this.stats.acc) + 1;
        let result = {};
        //Teste de ataque
        if(num <= 20){
            //Miss
            result.data = "miss";
        }else{
            //Regular
            $target.dmg( this.dmgF() );
            result.data = "normal";
        }
        return result;
    };
    // Take Damage
    Enemy.prototype.dmg = function(dmg){
        let dmgTotal = dmg -  dmg * (( Math.floor(Math.random() * this.stats.res) + 1 )/100);
        let hp = ((this.hp - dmgTotal) < 0)? 0 : Math.round(this.hp - dmgTotal);
        this.hp = hp;
        return {data: "success", dmg: dmgTotal};
    };
    // Check if the character is Alive
    Enemy.prototype.isAlive = function(){
        return this.hp > 0;
    };
    // Give XP when die
    Enemy.prototype.giveXp = function(){
        return this.xp;
    };
    // Drop an Item maybe
    Enemy.prototype.drop = function(){
        let max = this.items.length - 1;
        let item = this.items[ 0 ];
        return item;
    };
    /**
    * Private property
    */
    var possibleRoles = ['admin', 'editor', 'guest'];

    /**
    * Private function
    */
    function checkRole(role) {
        return possibleRoles.indexOf(role) !== -1;
    }

    /**
    * Static property
    * Using copy to prevent modifications to private property
    */
    Enemy.possibleRoles = angular.copy(possibleRoles);

    /**
    * Static method, assigned to class
    * Instance ('this') is not available in static context
    */
    Enemy.build = (data)=> {
        return new Enemy(
            data.name,
            data.ds,
            data.hand,
            data.img,
            data.hp,
            data.mhp,
            data.element,
            data.stats,
            data.stamrec,
            data.xp,
            data.item
        );
    };

    /**
    * Return the constructor function
    */
    return Enemy;
})
    .factory('Item', ()=>{
        
    function Item(data){
        data
    }
    
    Item.prototype.bagKey;
    
    Item.prototype.getBagKey = function(){
        return this.bagKey;
    };    
    
    Item.build = (data)=>{
        return new Item(data);
    }
    
    return Item;
             
    })
    .factory('Potion', function(){
        //var $this = angular.extend(Item, {})
        
        function Potion(name, type, num){
            this.name = name;
            this.type = type;
            this.num = num;
            this.typeItem = "potion";
            this.effect = [];
            startType();
            this.bagkey = 0;   
        }
    
        function startType(){
            var $this = this;
            switch($this.type){
                case "life":
                    $this.effect.push = "setHp";
                    $this.effect.push = "getHp";
                    $this.effect.push = "Hp";
                    break;
                case "mana":
                    $this.effect.push = "setMp";
                    $this.effect.push = "getMp";
                    $this.effect.push = "Mp";
                    break;
            }  
        };
    
        Potion.getSetter = function(){
            return this.effect[0];
        };
    
        Potion.getGetter = function(){
            return this.effect[1];
        };
    
        Potion.getTName = function(){
            return this.effect[2];
        };
    
        Potion.build = (data)=>{
            return new Potion(data.name, data.type, data.num);
        }
        
        return Potion;
});