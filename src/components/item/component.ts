import Container, {ContainerType} from "@/models/Container";
import Item, {ColourGroup, LaundryCategory, PackingCategory} from "@/models/Item";
import Vue from 'vue'
import Component from 'vue-class-component'
import {Prop} from "vue-property-decorator";
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

@Component
export default class ItemComponent extends Vue {
  @Prop()
  id: string;

  @Prop()
  container: string;

  @Prop()
  saved: string;

  updated: boolean = false;

  get formTitle() {
    return this.currentItem.name.length ? this.currentItem.name : 'Dodaj nowy przedmiot';
  }

  public currentItem: Item = new Item('');
  public error: string = '';

  public colorGroup = ColourGroup;
  public laundryCategory = LaundryCategory;
  public packingCategory = PackingCategory;

  async created() {
    if(this.id) {
      const doc = await this.$dao.getItemById(this.id, this.container);
      if(doc) {
        this.currentItem = doc;
      }
    }
  }

  addItem() {
    if(!this.currentItem.idContainer) {
      let defaultContainer = this.$store.state.containers.list.find((el: Container) => el.type == ContainerType.Default);
      if(defaultContainer) {
        this.currentItem.idContainer = defaultContainer.id;
      }
    }

    this.$dao.saveItem(this.currentItem).then((doc: any) => {
      if(doc) {
        this.$router.push({name: 'item', params: {id: doc.id, saved: "1"}});
      } else {
        this.updated = true;
      }
    });
  }

  cancel() {
    this.$router.go(-1);
  }
}