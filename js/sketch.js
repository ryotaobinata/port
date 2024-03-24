let hangyaku_font;

let start_flag=false;
let start_btn;
let pickaxe;
let start_bg_img;
let game_bg_img;
let menu_bg_img;
let back;

let game_flag=false;
let status_bar;
let ore;
let jewel_img;
let jewel;
let jewel_text;
let orb_img;
let orb;
let orb_text;
let max_ore_hp=10;
let now_ore_hp=max_ore_hp;
let hp_green_color;
let hp_red_color;
let hp_green;
let hp_red=490;
let ore_level=1;
let hp_increase_rate=10;
let destroy_flag=false;

let menu_flag=false;
let menu_btn;
let cross_btn;
let cross_btn_img;
let menu_page;

let player={
    power:1,
    jewel:0,
    orb:0
}

let damege;
let item;

let scene={
    start:0,
    game:1,
    menu:2
}
let now_scene;

let game_data={
    power:1,
    jewel:0,
    orb:0,
    max_ore_hp:10,
    //now_ore_hp:10,
    ore_level:1,
    hp_increase_rate:10
}


function preload(){
    game_bg_img=loadImage("assets/img/bg_img.jpg");
    start_bg_img=loadImage("assets/img/start_bg.png");
    menu_bg_img=loadImage("assets/img/menu_bg.png");
    hangyaku_font=loadFont("assets/font/Hangyaku-Rp6ye.ttf");
    jewel_img=loadImage("assets/img/jewel.png");
    orb_img=loadImage("assets/img/orb.png");
    menu_page=loadImage("assets/img/paper.png");
    cross_btn_img=loadImage("assets/img/cross.png");

}

function setup(){
    createCanvas(800,600);

    textFont(hangyaku_font);


//gameの設定
    ore=new Sprite();
    ore.img="assets/img/ore_0.png";
    ore.d=500;
    ore.scale=0.4;
    ore.y=370;
    ore.collider='n';
    ore.visible=false;

    menu_btn=new Sprite();
    menu_btn.collider='n';
    menu_btn.x=100;
    menu_btn.y=450;
    menu_btn.text='menu';
    menu_btn.visible=false;

    jewel=new Sprite();
    jewel.layer=2;
    jewel.scale=2;
    jewel.x=100;
    jewel.y=25;
    jewel.collider='n';
    jewel.img=jewel_img;
    jewel.visible=false;


    orb=new Sprite();
    orb.layer=2;
    orb.scale=2;
    orb.x=450;
    orb.y=25;
    orb.collider='n';
    orb.img=orb_img;
    orb.visible=false;


    pickaxe=new Sprite();
    pickaxe.img="assets/img/stone_pickaxe.png";
    pickaxe.scale=0.3;
    pickaxe.collider='n';
    pickaxe.visible=false;

//gameの設定

//menuの設定
    cross_btn=new Sprite();
    cross_btn.img=cross_btn_img;
    cross_btn.x=700;
    cross_btn.y=90;
    cross_btn.collider='n';
    cross_btn.visible=false;
    
//menuの設定


    now_scene=scene.start;

}

function draw(){
    clear()
    
    switch (now_scene) {
        case scene.start:
            draw_start();
            break;
        case scene.game:
            
            if(game_flag==false){
                init_game();
            }

            draw_game();
            break;
        case scene.menu:

            if(menu_flag==false)
            {
                init_menu();
            }
            draw_menu();
            break;
        default:
            break;
    }
   



    if(mouse.presses()) console.log(mouse.x,mouse.y);
}

function save_game(){
    
    game_data.power=player.power;
    game_data.jewel=player.jewel;
    game_data.orb=player.orb;
    game_data.ore_level=ore_level;
    game_data.max_ore_hp=max_ore_hp;
    //game_data.now_ore_hp=now_ore_hp;
    game_data.hp_increase_rate=hp_increase_rate;

    localStorage.setItem('game_data',JSON.stringify(game_data));
}

function load_game(){
    let saved_data=localStorage.getItem('game_data');
    if(saved_data)
    {
        game_data=JSON.parse(saved_data);

        player.power=game_data.power;
        player.jewel=game_data.jewel;
        player.orb=game_data.orb;
        ore_level=game_data.ore_level;
        max_ore_hp=game_data.max_ore_hp;
        now_ore_hp=max_ore_hp;
        hp_increase_rate=game_data.hp_increase_rate;

    }
}

function draw_start(){
    background(start_bg_img);

    if(start_flag==false)
    {
        start_btn=new Sprite();
        start_flag=true;
    }

    if(start_btn.mouse.released())
    {
        now_scene=scene.game;
        load_game();
        start_btn.remove();
    }

}

function init_game(){
    
    game_flag=true;

    ore.visible=true;
    pickaxe.visible=true;
    jewel.visible=true;
    orb.visible=true;
    menu_btn.visible=true;
    ore.collider='s';
    menu_btn.collider='s';

}

function finalize_game(){
    game_flag=false;

    ore.visible=false;
    pickaxe.visible=false;
    jewel.visible=false;
    orb.visible=false;
    menu_btn.visible=false;
    ore.collider='n';
    menu_btn.collider='n';
}

function draw_game(){

    background(game_bg_img);

    //ピッケルに関して
    pickaxe.moveTowards(mouse,1);
    if(mouse.presses()) pickaxe.rotate(-45,40);
    else if(mouse.released()) pickaxe.rotate(45,40);

    //鉱石に関して
    if(ore.mouse.presses()){
        update_ore_hp();
        draw_pickaxe_damege();
    }
    draw_ore_hp();
    if(destroy_flag==true) {
        next_ore_level();

        update_jewel();
        draw_jewel();
        
        if(ore_level%20==0)
        {
            update_orb();
            draw_orb();
        }
    }
    

    //メニューを開く
    if(menu_btn.mouse.presses())
    {
        now_scene=scene.menu;
        finalize_game();
    }


    //ゲームのセーブ
    if(kb.presses('s'))
    {
        save_game();
    }

    //ステータスの更新
    draw_status_bar();

    //鉱石のレベルのテキスト
    textAlign(CENTER);
    fill('white');
    textSize(60);
    text('第'+ore_level+'の鉱石',400,110);
    textAlign(CORNER);

}

function update_ore_hp(){

    //鉱石のhpが0より大きい場合
    if(now_ore_hp-player.power>0){
        now_ore_hp=now_ore_hp-player.power; //鉱石のhpを減らす
    }else if(now_ore_hp-player.power<=0){   //鉱石のhpが0以下になる場合
        now_ore_hp=0; //鉱石のhpを0にして破壊のフラグをtrueにする
        destroy_flag=true;
    }

}

function draw_ore_hp(){

    hp_green_color=color(87,189,34);
    hp_red_color=color('red');
    hp_green=490/max_ore_hp;
    

    if(hp_green*now_ore_hp<hp_red) hp_red-=3;
    else if(hp_red-3<=0) hp_red=0;

    noStroke();
    //hpbar grey
    fill(79);
    rect(150,125,500,60,10);
    
    //hpbar red
    fill(hp_red_color);
    rect(155,130,hp_red,50,10);

    //hpbar green
    fill(hp_green_color);
    rect(155,130,hp_green*now_ore_hp,50,10);

    //hptext
    fill('white');
    textAlign(RIGHT,CENTER);
    text(now_ore_hp,620,195);
    textAlign(CORNER,CORNER);
}

function next_ore_level(){
    destroy_flag=false;
    ore_level++;
    max_ore_hp=max_ore_hp+(int)(ore_level*(hp_increase_rate/100));
    now_ore_hp=max_ore_hp;
    hp_red=490;
}

function update_jewel(){
    player.jewel++;
}

function draw_jewel(){
    item=new Sprite(400,370);
    item.img=jewel_img;
    item.layer=2;
    item.life=40;
    item.scale=2;
    item.collider='n';
    item.vel.y=-6
}

function update_orb(){
    player.orb++;
}

function draw_orb(){
    item=new Sprite(400,370);
    item.img=orb_img;
    item.layer=2;
    item.life=40;
    item.scale=2;
    item.collider='n';
    item.vel.y=-4;
}

function draw_pickaxe_damege()
{
    damege=new Sprite(mouse.x+20,mouse.y-20);
    damege.color=color(0,0,0,0);
    damege.stroke=color(0,0,0,0);
    damege.text=player.power;
    damege.textColor='white'
    damege.textSize=50;
    damege.collider='n';
    damege.life=40;
    damege.vel.y=-6;
}

function draw_status_bar(){

    fill('grey');
    rect(0,0,800,50);

    fill('white');
    textAlign(LEFT,CENTER);
    text(player.jewel,135,20);

    text(player.orb,485,20);
    textAlign(CORNER,CORNER);

}

function init_menu(){
    menu_flag=true;

    cross_btn.collider='s';
    cross_btn.visible=true;

}

function finalize_memu(){
    menu_flag=false;

    cross_btn.collider='n';
    cross_btn.visible=false;

}

function draw_menu(){

    background(menu_bg_img);

    image(menu_page,50,50,700,500);

    if(cross_btn.mouse.presses()){
        now_scene=scene.game;
        finalize_memu();
    }
}