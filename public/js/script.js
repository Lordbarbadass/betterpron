let app = new Vue({
  el: "#container",
  data: {
    url: "",
    images: [],
    urlRegExp: /https:\/\/e-hentai.org\/g\/(?:.+?)\/(?:.+?)\//,
    isLoading: false,
    page: 0
  },
  methods: {
    async getGallery() {
      this.isLoading = true;
      this.page = 0;
      this.images = [];
      history.pushState(null, "", `./?q=${encodeURI(this.url)}`)
      let res = await fetch(`/gallery?url=${encodeURI(this.url)}`, { headers: { "Content-Type": "application/json" } });
      this.isLoading = false;
      data = await res.json();
      if (!data.error)
        this.images = data.images;
      else
        console.error(data.message);
    },
    movePage (delta) {
      this.page += delta;
      if (this.page < 0) this.page = 0;
      window.scrollTo(0,0);
    }
  },
  computed: {
    isUrlValid() {
      return this.url && this.urlRegExp.test(this.url);
    },
    curPage() {
      return this.images ? this.images.slice(this.page * 50, this.page * 50 + 50) : [];
    }
  },
  watch: {
    url (val, oldval) {
      if (!this.isUrlValid) return;
      else this.getGallery();
    }
  },
  mounted() {
    this.url = document.querySelector("#url").textContent;
  }
})