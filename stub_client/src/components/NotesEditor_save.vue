<template>
<v-layout row>
<v-flex xs12>
  <v-toolbar>
    <v-btn flat icon @click="edit_note" color="black">
      <v-icon>code</v-icon>
    </v-btn>
    <v-btn flat icon @click="update_note" color="green">
      <v-icon>check_circle</v-icon>
    </v-btn>
    <v-btn flat icon @click="dialog = true" color="red">
      <v-icon>delete</v-icon>
    </v-btn>      
    <v-text-field v-if="edit" auto-grow v-model="note.title"></v-text-field>
  </v-toolbar>
  <v-divider/>
  <v-combobox
  label="Добавить теги"
    v-model="note.tags"
    :items="items"
    hide-selected
    multiple
    small-chips
    solo
  ></v-combobox>
    <v-layout row>
      <v-flex xs6 v-if="edit">
        <Editor v-model="note.content" label="Markdown" />
      </v-flex>
      <v-flex xs6>
        <v-card v-if="edit">
          <div v-html="textCompiled"></div>
        </v-card>
      </v-flex>
    </v-layout>
    <v-flex>
      <v-card id= 'editor' v-if="!edit">
        <div v-html="textCompiled"></div>
      </v-card>
    </v-flex>
</v-flex>
<!-- диалог удаления -->
  <v-dialog v-model="dialog" max-width="290">
    <v-card>
    <v-card-title class="headline">Удалить заметку?</v-card-title>  
      <v-card-actions>
      <v-spacer></v-spacer>
        <v-btn color="green darken-1" flat="flat" @click="dialog = false">Отмена</v-btn>
        <v-btn color="red darken-1" flat="flat" @click="delete_note">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>
</template>

<script>
import {EventBus} from '@/event-bus.js';
import marked from 'marked'
import Editor from "./editor";
export default {
  name: 'notes-editor',
  // props: ["note"],
  data() {
    return {
      edit: false,
      dialog: false,
      note: this.$root.$data.notes[0],
      items: [],
    }
  },
  components: {
      Editor
  },
  created () {
    EventBus.$on('selected_note',data => {
      this.note = data
    });
    EventBus.$on('save',data => {
      this.update_note();
    });
    this.getTags();
  },
  computed: {
    textCompiled() { return marked(this.note.content) }
  },
  methods: {
    edit_note () {
      if (!this.edit) {this.edit = true}
        else {this.edit = false}
    },
    update_note () {
      this.$socket.emit('updateNotes',this.note);
      this.edit = false;
      console.log(this.note)
    },
    delete_note () {
      this.$socket.emit('delete_note',this.note.id);
      this.dialog = false;
      EventBus.$emit('delete_note',this.note);
    },
    getTags() {
      let obj = {};
        this.$root.$data.notes.forEach(el => {
            if (el.tags) {
                for (var i = 0; i < el.tags.length; i++) {
                    var str = el.tags[i];
                    obj[str] = true; // запомнить строку в виде свойства объекта
                }
            }
        });
        // console.log(Object.keys(obj))
    }    
  }
}
</script>

<style>
#editor {
  /* height:600px; */
  font-family: Consolas, Monaco, Inconsolata, Menlo, monospace, "Lucida Console";
  padding: 10px; 
}
</style>