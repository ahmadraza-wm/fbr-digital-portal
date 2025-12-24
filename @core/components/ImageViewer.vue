<template>
  <v-card class="pa-4" elevation="8">
    <v-row>
      <!-- Controls -->
      <v-col cols="12" class="d-flex justify-center mt-4" style="z-index: 1000;">
        <v-btn icon @click="zoomIn" class="mx-1" title="Zoom In">
          <VIcon icon="tabler-zoom-in-filled" />
        </v-btn>
        <v-btn icon @click="zoomOut" class="mx-1" title="Zoom Out">
          <VIcon icon="tabler-zoom-out-filled" />
        </v-btn>
        <v-btn icon @click="rotateLeft" class="mx-1" title="Rotate Left">
          <VIcon icon="tabler-rotate-2" />
        </v-btn>
        <v-btn icon @click="rotateRight" class="mx-1" title="Rotate Right">
          <VIcon icon="tabler-rotate-clockwise-2" />
        </v-btn>
        <v-btn icon @click="reset" class="mx-1" title="Reset">
          <VIcon icon="tabler-restore" />
        </v-btn>
      </v-col>

      <!-- Image Display -->
      <v-col cols="12">
        <div class="image-container" @mousedown="startDrag" @mousemove="onDrag" @mouseup="endDrag" @mouseleave="endDrag"
          @touchstart="startDrag" @touchmove="onDrag" @touchend="endDrag">
          <v-img ref="image" :src="imageUrl" class="image" :style="imageStyle" max-height="400" max-width="100%"
            contain />
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    imageUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      scale: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      dragging: false,
      lastX: 0,
      lastY: 0
    };
  },
  computed: {
    imageStyle() {
      return {
        transform: `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale}) rotate(${this.rotate}deg)`,
        transition: this.dragging ? 'none' : 'transform 0.3s ease',
        cursor: this.scale > 1 ? 'grab' : 'default'
      };
    }
  },
  methods: {
    zoomIn() {
      this.scale += 0.1;
    },
    zoomOut() {
      this.scale = Math.max(0.5, this.scale - 0.1);
    },
    rotateLeft() {
      this.rotate -= 90;
    },
    rotateRight() {
      this.rotate += 90;
    },
    reset() {
      this.scale = 1;
      this.rotate = 0;
      this.translateX = 0;
      this.translateY = 0;
    },
    startDrag(e) {
      if (this.scale <= 1) return;
      this.dragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      this.lastX = clientX - this.translateX;
      this.lastY = clientY - this.translateY;
    },
    onDrag(e) {
      if (!this.dragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      this.translateX = clientX - this.lastX;
      this.translateY = clientY - this.lastY;
    },
    endDrag() {
      this.dragging = false;
    }
  }
};
</script>

<style scoped>
.image-container {
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
  max-block-size: 400px;
  touch-action: none;
  /* prevent scrolling on mobile when dragging */
}

.image {
  pointer-events: none;
  /* prevent interference with drag */
  transition: transform 0.3s ease;
  user-select: none;
}
</style>
