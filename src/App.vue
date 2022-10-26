<template>
  <div id="app">
    <div class="row col-12 cards">
      <div class="main-buttons">
        <button v-if="isDeckShuffled" @click="displayDefaultDeck" class="button is-primary is-outlined">
          Reset <i class="fas fa-undo"></i>
        </button>
        <button @click="shuffleDeck" class="button is-primary">
          Shuffle <i class="fas fa-random"></i>
        </button>
      </div>
      <transition-group name="shuffleMedium" tag="div" class="deck">
        <div v-for="card in cards" :key="card.id"
            class="card"
            :class="iconColor[card.icon]">
          <span class="card__icon card__icon--top">{{ card.icon }}</span>
          <span class="card__number">{{ card.number }} </span>
          <span class="card__icon card__icon--bottom">{{ card.icon }}</span>
        </div>
      </transition-group>
    </div>

    <div>
      <b-container>
        <b-row v-for="(player, i) in playersDeck" :key="player">
          {{`Player ${i + 1} ${player.total >= matchedValue ? "- Winner" : ""}`}}
          <transition-group name="shuffleMedium" class="deck">
            <b-col v-for="card in player" :key="card.number + card.icon" class="card" :class="iconColor[card.icon]">
              <span class="card__icon card__icon--top">{{ card.icon }}</span>
              <span class="card__number">{{ card.number }} </span>
              <span class="card__icon card__icon--bottom">{{ card.icon }}</span>
            </b-col>
          </transition-group>
        </b-row>
      </b-container>
    </div>
    
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  data() {
    return { 
      numbers: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
      icons: ['♥','♦','♠','♣'],
      cards: [],
      iconColor: {
        '♠': 'black',
        '♣': 'black',
        '♦': 'red',
        '♥': 'red',
      },
      isDeckShuffled: false,
      shuffleCount: 0,
      players: 4,
      playersDeck:[],
      matchedValue: 0
    }
  },
  created() {
    this.displayDefaultDeck();
  },  
  methods: {
    displayDefaultDeck() {
      let id = 1;
      this.cards = [];
      
      for( let r = 0; r < this.numbers.length; r++ ) {
        for( let s = 0; s < this.icons.length; s++ ) {
          let card = {
            id: id,
            number: this.numbers[r],
            icon: this.icons[s]
          }
          this.cards.push(card);
          id++;
        }
      }

      this.isDeckShuffled = false;
      this.shuffleCount = 0;
      this.playersDeck = Array;
    },
    shuffleDeck() {        
      for(let i = this.cards.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * i);
        
        let temp = this.cards[i];
        Vue.set(this.cards, i, this.cards[randomIndex]);
        Vue.set(this.cards, randomIndex, temp);
      }

      this.isDeckShuffled = true;
      this.shuffleCount = this.shuffleCount + 1;
      this.setPlayerCards()
    },
    setPlayerCards(){
      let players = this.players
      let result = this.cards.reduce((r, v, i) => {
        r[i % players] = r[i % players] || [];
        r[i % players].push(v);
        return r;
      }, []);
      for (let index = 0; index < players; index++) {
        const cards = result[index];
        const res = [...cards.reduce( (mp, o) => {
          if (!mp.has(o.number)) mp.set(o.number, { ...o, count: 0 });
          mp.get(o.number).count++;
          return mp;
        }, new Map).values()];
        let total = 0
        res.reduce((n, {count}) => {
          total = total + (count > 1 ? count : 0)
        })
        result[index].total = total
      }
      this.matchedValue = Math.max.apply(Math, result.map(function(obj) { return obj.total; }));
      
      this.playersDeck = result
    },
    containsDuplicates(array) {
      if (array.length !== new Set(array).size) {
        return true;
      }

      return false;
    }
  },
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Roboto+Slab:300,400,700");

html, body, #app {
  height: 100%;
}

.title {
  font-family: Roboto Slab, sans-serif;
  text-align: center;
  padding-top: 30px;
  margin-bottom: 0 !important;
  font-weight: 300;
  font-size: 3rem;
}

.vue-logo {
  height: 55px;
  position: relative;
  top: 10px;
}

.speed-buttons {
  text-align: center;
  padding-top: 30px;
}
.speed-buttons .button {
  height: 2.50em;
}

.main-buttons {
  display: block;
  margin: 0 auto;
  text-align: center;
  padding-top: 30px;
  margin-bottom: 0 !important;
}

.count-section {
  position: absolute;
  top: 10px;
  right: 10px;
}

.fas {
  padding-left: 5px;
}

.deck {
  margin-left: 30px;
  padding-top: 30px;
}

.card {
  width: 75px;
  height: 100px;
  float: left;
  margin-right: 5px;
  margin-bottom: 5px;
  border-radius: 2px;
}

.card__icon {
  width: 100%;
  display: block;
}

.card__icon--top {
  text-align: left;
  padding-left: 5px;
}

.card__icon--bottom {
  position: absolute;
  bottom: 0px;
  text-align: left;
  transform: rotate(180deg);
  padding-left: 5px;
}

.card__number {
  width: 100%;
  position: absolute;
  top: 38%;
  text-align: center;
}

.red {
  color: #FF0000;
}

.black {
  color: #000;
}

.twitter-section {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.twitter-section .fa-twitter-square {
  color: #00d1b2;
  font-size: 30px;
}

.shuffleMedium-move {
  transition: transform .5s;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.cards {
  margin-bottom: 20px;
}

@media (max-width: 1210px) {
  .deck {
    position: initial;
    top: 0;
  }

  .twitter-section {
    display: none;
  }
}

</style>