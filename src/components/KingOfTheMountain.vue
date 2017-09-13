<template>
  <div class="kom">
    <h1>Hello {{ athlete.firstname }} {{ athlete.lastname }}</h1>
    <h3>My King of the mountain awards:</h3>
    <div v-if="kom === null">
      <p>Loading...</p>
    </div>
    <div v-else-if="kom.length">
      <ul class="kom list">
        <li v-for="kom in kom">
          <a target="_blank" :href="`https://www.strava.com/segments/${ kom.segment.id }`">
            <span class="segment-name">{{ kom.name }}</span>
            <br/>
            <span class="segment-rank">{{ getGetOrdinal(1) }}</span>
          </a>
        </li>
      </ul>
    </div>
    <div v-else>
      <h4>You dont have any King of the Mountain awards yet. Keep on trying!</h4>
    </div>
    <h3>My Current Top 10's:</h3>
    <div v-if="currentTop10 === null">
      <p>Loading...</p>
    </div>
    <div v-else-if="currentTop10.length">
      <ul class="top10 list">
        <li v-for="currentTop10 in currentTop10">
          <a target="_blank" :href="`https://www.strava.com/segments/${currentTop10.segment}`">
            <span class="segment-name">{{ currentTop10.segment.name }}</span>
            <br/>
            <span class="segment-rank">{{ getGetOrdinal(currentTop10.rank) }}</span>
          </a>
        </li>
      </ul>
    </div>
    <div v-else>
      <h4>You don't have any top 10's yet. Keep on trying!</h4>
    </div>
    <h3>My Starred Segments:</h3>
    <div v-if="starred === null">
      <p>Loading...</p>
    </div>
    <div v-else-if="starred.length">
      <ul class="starred list">
        <li v-for="starred in starred">
          <a target="_blank" :href="`https://www.strava.com/segments/${segments.id}`">
            {{ starred.name }}
          </a>
        </li>
      </ul>
    </div>
    <div v-else>
      <h4>You don't have any starred segments. Star a segment on strava to get started.</h4>
    </div>
  </div>
</template>


<script>
  function getCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length == 2) return parts.pop().split(';').shift();
  }

  const all = (...fns) => Promise.all(fns.map(f => f()));
  const getPos = (arr, top, bottom = 0) => {
    return arr && arr.filter(x => x.rank <= top && x.rank > bottom);
  };

  const get = token => async url => await fetch(url, {
    method: 'get',
    headers: { 'Authorization': `Bearer ${token}` },
  }).then(x => x.json());

  export default {
    name: 'kom',
    async mounted() {
      const access_token = getCookie('at');
      if (!access_token) this.$router.replace({ path: '/' });
      const firstname = getCookie('f');
      const lastname = getCookie('l');
      const athlete_id = getCookie('id');
      const getData = get(access_token);

      let hitLast = false;
      let activityArray = [];
      let count = 1;
      while (hitLast === false) {
        const activities = await getData(`https://www.strava.com/api/v3/athlete/activities?per_page=200;page=${count}`);
        if (activities.length) {
          activityArray = [ ...activityArray, ...activities ];
          count++;
        } else {
          hitLast = true;
        }
      }

//      const activityArray = await getData(`https://www.strava.com/api/v3/athlete/activities?per_page=100;`);
      const activityData = await all(...activityArray.map(x => () => getData(`https://www.strava.com/api/v3/activities/${x.id}`)));

      const segments = activityData.reduce((acc, curr) => {
        const segmentArr = curr.segment_efforts.filter(x => x.achievements.length);
        return [ ...segmentArr, ...acc ];
      }, []);

      const prevTop10 = [ ...new Set(segments.filter(x => x.achievements.find(x => x.type_id === 2)).map(x => x.segment.id)) ]; // Previous top10 segment ID's
      const leaderboards = await all(...prevTop10.map(x => () => getData(`https://www.strava.com/api/v3/segments/${x}/leaderboard`)));

      const positions = leaderboards
        .map(x => (x.entries.find(y => y.athlete_name === `${firstname} ${lastname}`)))
        .map((x, i) => ({ ...x, segment: prevTop10[ i ] }))
        .filter(x => x);

      const currentTop10 = [ ...new Set(getPos(positions, 10, 1)) ];
      const kom = await getData(`https://www.strava.com/api/v3/athletes/${athlete_id}/koms`);
      const starred = await getData('https://www.strava.com/api/v3/segments/starred');

      this.starred = starred;
      this.kom = kom;
      this.currentTop10 = currentTop10;
      this.segments = segments;
    },
    methods: {
      getGetOrdinal(n) {
        const s = [ 'th', 'st', 'nd', 'rd' ];
        const v = n % 100;
        return n + (s[ (v - 20) % 10 ] || s[ v ] || s[ 0 ]);
      },
    },
    data: () => ({
      intro: 'My Runs...',
      athlete: {
        firstname: getCookie('f'),
        lastname: getCookie('l'),
      },
      starred: null,
      segments: null,
      currentTop10: null,
      top10: null,
      kom: null,
      currentPosOfPreviousTop10: null,
    }),
  }
  ;
</script>

<style scoped>
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 70%;
    margin: auto;
    -webkit-padding-start: 0;
  }

  h3 {
    font-size: 1.7em;
  }

  a {
    cursor: pointer;
  }

  .segment-name {
    font-size: 1.2em;
  }

  .segment-rank {
    font-size: 1.4em;
  }

  .list li {
    list-style: none;
    margin: 10px;
    max-width: 33%;
  }

  @media (max-width: 640px) {
    .list li {
      max-width: inherit;
    }
  }
</style>
