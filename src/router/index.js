import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/Login';
import KingOfTheMountain  from '@/components/KingOfTheMountain';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'App',
      component: Login,
    },
    {
      path: '/my-runs',
      name: 'Kom',
      component: KingOfTheMountain,
    },
  ],
});
