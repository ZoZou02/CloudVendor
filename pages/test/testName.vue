<template>
  <div>
    <!-- 显示点击的元素的属性数据 -->
    <div v-if="clickedElement">
      <h2>点击的元素属性数据</h2>
      <p>标签名: {{ clickedElement.tagName }}</p>
      <p>类名: {{ clickedElement.className }}</p>
      <p>id: {{ clickedElement.id }}</p>
      <p>其他属性: {{ clickedElementAttributes }}</p>
    </div>

    <!-- 示例元素 -->
    <div id="example" class="example-class" @click="handleClick">
      点击我查看属性数据
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clickedElement: null, // 存储点击的元素的属性数据
      clickedElementAttributes: {} // 存储点击的元素的其他属性
    };
  },
  methods: {
    handleClick(event) {
      // 获取点击的元素
      const clickedElement = event.target;
      
      // 获取元素的属性数据
      const tagName = clickedElement.tagName;
      const className = clickedElement.className;
      const id = clickedElement.id;
      
      // 获取元素的其他属性
      const otherAttributes = {};
      for (const attr of clickedElement.attributes) {
        if (attr.nodeName !== 'class' && attr.nodeName !== 'id') {
          otherAttributes[attr.nodeName] = attr.nodeValue;
        }
      }
      
      // 更新数据属性
      this.clickedElement = {
        tagName,
        className,
        id
      };
      this.clickedElementAttributes = otherAttributes;
    }
  }
};
</script>
