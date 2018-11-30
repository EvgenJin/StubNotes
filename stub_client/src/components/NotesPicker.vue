<template>
<v-layout row>
  <v-flex>
    <v-card>
      <v-toolbar color="">
        <v-text-field placeholder="Поиск" v-model="query"/>
        <v-spacer></v-spacer>
      </v-toolbar>
        <v-divider/>
      <v-toolbar color="">
        <v-text-field placeholder="Добавить" v-model="newNoteInput" @keyup.enter="addNote"/>
        <v-btn icon :disabled="!newNoteInput" @click="addNote">
          <v-icon>add_circle</v-icon>
        </v-btn>
      </v-toolbar>
      <virtual-list :size="100" :remain="7">
      <v-list>
        <v-list-tile v-for="n in filteredNotes" :key="n.id" @click="get_one(n.id)">
          <v-list-tile-content>
            <v-list-tile-title v-text="n.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      </virtual-list>
    </v-card>
  </v-flex>
</v-layout>
</template>
<script>
import {EventBus} from '@/event-bus.js';
import virtualList from 'vue-virtual-scroll-list'
export default {
  name: 'notes-picker',
  data() {
    return {
      selectedNoteId: this.$root.$data.notes.reduce((acc, n) => Math.min(acc, n.id), Number.MAX_VALUE),
      query: '',
      newNoteInput: '',
      notes: this.$root.$data.notes
    }
  },
  components: {
    virtualList
  },  
  created () {
    // удалить запись (из едитора)
    EventBus.$on('delete_note',data => {
      let id = this.notes.indexOf(data)
      this.notes.splice(id, 1);
    });
  },
  computed: {
    // искать записи
    filteredNotes: function() {
      let vm = this;
      return this.query === '' ? this.notes : this.notes.filter(n => {
        let pattern = new RegExp(this.query, 'gi')
        return pattern.test(n.content)||pattern.test(n.title)||pattern.test(n.tags)
      })
    }
  },
  methods: {
    // передать в едитор выбранную запись
    get_one (id) {
      let res = this.notes.filter(n => n.id == id);
        res = res[0]
      EventBus.$emit('selected_note',res);
    },
    // добавить запись
    addNote: function() {
      if (!this.newNoteInput) return
      let note = {
        id: this.notes.reduce((acc, n) => Math.max(acc, n.id), 0) + 1,
        title: this.newNoteInput,
        content: '',
        tags: []
      }
      // очистить строку поиска
      this.newNoteInput = '';
      // послать объект на отрисовку в редактор
      EventBus.$emit('selected_note',note);
      // послать объект на сервер
      this.$socket.emit('addNote',note);
      // добавить объект в массив
      this.notes.push(note);
    },
  }
}
</script>
