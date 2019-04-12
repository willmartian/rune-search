//creates a string ascii hp bar
class HpBar {
  private currentHealth: number; //the current health
  private maxHealth: number; //max hp
  private maxBar: number = 5; //max number of bars to represent hp in string
  private barString: string; //this is the hp bar

  constructor(max: number){
    this.currentHealth = max; //hp is full when bar is created
    // this.maxHealth = max;
    // this.barString = "██████████";
    this.barString = "<3 ".repeat(this.currentHealth);

  }

//update will update the currentHealth and reupdate the barString
//update will take in cur which is the new current hp hpBar should be updated
//with
  update(cur: number): void {
    // if(cur != this.currentHealth){
    //   this.currentHealth = cur;
    //   var tmp: number = this.currentHealth * 10/this.maxHealth;
    //   var i: number = 0;
    //   this.barString = "";

    //   //remaking barString
    //   while(i < this.maxBar){
    //      if(i < tmp) {
    //           this.barString = this.barString + "<3 ";
    //      } else {
    //         this.barString = this.barString + "   ";
    //      }
    //      i = i+1;
    //   }
    // }
    this.barString = "<3 ".repeat(cur);

  }

  get bar(): string{
    return this.barString;
  }

}
