<template>
  <div class="sidebar" :style="{ width: 180 + 'px' }">
    <div class="sidebar-warp">
      {{ menuList }}
      <el-scrollbar style="height: 100%">
        <el-menu
          ref="menu"
          :default-active="$route.path"
          :collapse="false"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF">
          <template v-for="(item, index) in menuList">
            <!-- 无子节点 -->
            <template v-if="!item.children">
              <router-link :to="{ name: item.routeName }" :key="index" class="router-link">
                <el-menu-item :index="item.path">
                  <i class="icon iconfont menu-icon" :class="item.icon"></i>
                  <span slot="title">{{ item.title }}</span>
                </el-menu-item>
              </router-link>
            </template>
            <!-- 有子节点 -->
            <template v-else>
              <el-sub-menu :index="item.routeName" :key="index">
                <template slot="title">
                  <i class="icon iconfont menu-icon" :class="item.icon"></i>
                  <span slot="title">{{ item.title }}</span>
                </template>
                <router-link v-for="(itm, idx) in item.children" :key="itm.routeName" :to="{ name: itm.routeName }">
                  <el-menu-item :index="itm.path" :key="idx">
                    <span slot="title">{{ itm.title }}</span>
                  </el-menu-item>
                </router-link>
              </el-sub-menu>
            </template>
          </template>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import menuRoutes from '@/menuRoutes'
export default {
  name: 'CSidebar',
  data() {
    return {
      menuList: menuRoutes,
      sidebar: {
        open: true,
        width: 180
      }
    }
  },
  mounted() {
    if (this.$route.meta && this.$route.meta.parentPath) {
      this.$refs.menu.activeIndex = this.$route.meta.parentPath
    }
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal.meta && newVal.meta.parentPath) {
        this.$refs.menu.activeIndex = newVal.meta.parentPath
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.sidebar {
  background-color: #304156;
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }
  .sidebar-warp {
    height: calc(100% - 50px);
  }

  transition: width 0.28s;
  height: 100%;
  position: fixed;
  font-size: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  overflow-y: auto;
  a {
    display: inline-block;
    width: 100%;
  }
  .el-menu {
    border: none;
    width: 100% !important;
  }
}
.el-submenu {
  .el-menu {
    .el-menu-item {
      background-color: #1f2d3d !important;
    }
  }
}
.menu-icon {
  color: #fff;
}
</style>

<style lang="scss">
.sidebar {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
