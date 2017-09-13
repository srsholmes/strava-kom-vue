<template>
  <div class="hello">
    <h1>{{ intro }}</h1>
    <div v-if="loading">
      <h2>Loading...</h2>
    </div>
    <div v-if="athlete">
      {{ athlete }}
    </div>
    <div v-else>
      <a :href="redirect_url">{{ login }}</a>
    </div>
  </div>
</template>

<script>
  function getParameterByName(name) {
    const match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[ 1 ].replace(/\+/g, ' '));
  }

  // TODO: Substitute in real urls based on env.
  const app_url = 'localhost:8080';
  const api_url = 'localhost:3000/dev';

  export default {
    name: 'hello',
    async mounted() {
      const code = getParameterByName('code');
      if (code) {
        this.loading = true;
        const { access_token, athlete: { id, firstname, lastname } } = await fetch(`${api_url}/login?state=mystate&code=${code}`, { method: 'get' }).then(x => x.json());
        this.loading = false;
        document.cookie = `at=${access_token};`;
        document.cookie = `f=${firstname};`;
        document.cookie = `l=${lastname};`;
        document.cookie = `id=${id};`;
        history.pushState(null, '', location.href.split('?')[0]);
        this.$router.replace({ path: 'my-runs' });
      }
    },
    data: () => ({
      intro: 'King of the Mountain',
      athlete: null,
      loading: false,
      login: 'Login with Strava',
      redirect_url: `https://www.strava.com/oauth/authorize?client_id=19800&response_type=code&redirect_uri=http://${app_url}&scope=view_private&state=mystate&approval_prompt=force`,
    }),
  };
</script>

