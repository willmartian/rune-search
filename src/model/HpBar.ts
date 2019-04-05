//creates a string ascii hp bar
class HpBar {
  private currentHealth: number; //the current health
  private maxHealth: number; //max hp
  private maxBar: number = 10; //max number of bars to represent hp in string
  private barString: string; //this is the hp bar

  constructor(max: number){
    this.currentHealth = max; //hp is full when bar is created
    this.maxHealth = max;
    // this.barString = "██████████";
    this.barString = "[][][][][]"

  }

//update will update the currentHealth and reupdate the barString
//update will take in cur which is the new current hp hpBar should be updated
//with
  update(cur: number): void {
    if(cur != this.currentHealth){
      this.currentHealth = cur;
      var tmp: number = this.currentHealth * 10/this.maxHealth;
      var i: number = 0;
      this.barString = "";

      //remaking barString
      let left = true;
      while(i < this.maxBar){
         if(i < tmp) {
             var re = /░/;
            if (left) {
              // this.barString = this.barString + "█";
              this.barString = this.barString + "[";
            } else {
              this.barString = this.barString + "]";
            }
            left = !left;
         } else {
           // this.barString = this.barString + "░";
            this.barString = this.barString + " ";

         }
         i = i+1;
      }
    }
  }

  get bar(): string{
    return this.barString;
  }

}
