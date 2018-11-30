<template>
  <v-app>
    <v-content>
      <v-container grid-list-md fluid>
        <v-layout row wrap v-if="notes">
          <v-flex xs2 text-xs-center>
          <notes-picker></notes-picker>
          </v-flex>
          <v-flex xs10>
          <notes-editor></notes-editor>
          <file></file>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app>EvgenJin</v-footer>
  </v-app>
</template>

<script>
import NotesEditor from './components/NotesEditor'
import NotesPicker from './components/NotesPicker'

export default {
  name: 'app',
  data() {
    return {
      notes: null,
    }
  },
  components: {
    NotesEditor,
    NotesPicker,
  },
  created () {
    this.initialize()
  },
  methods: {
    initialize () {
      this.$socket.emit('getNotes');
        this.$socket.on('getNotes',data => {
          this.$root.$data.notes = data
          this.notes = this.$root.$data.notes
      });
    },
  }
}
</script>


<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

*{
    font-family: 'Idealist';
    font-size: 17px;
 }
</style>
