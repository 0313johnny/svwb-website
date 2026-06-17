<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-dark" elevated>
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold">
          <span class="text-primary">Shadowverse: World Beyond 社群網站</span>
        </q-toolbar-title>

        <q-tabs dense no-caps indicator-color="primary" align="right">
          <q-route-tab to="/" label="卡牌圖鑑" icon="style" />
          <q-route-tab to="/deck-builder" label="牌組製作" icon="construction" />
          <q-route-tab to="/url-test" label="網址匯入" icon="download" />
          <q-route-tab to="/deck-compare" label="牌組比較" icon="compare_arrows" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
