<template>
    <div>
        <div ref="editorRef" id="editor-el"></div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted } from "vue";
  import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
  import { Autoformat } from "@ckeditor/ckeditor5-autoformat";
  import { Bold, Code, Italic } from "@ckeditor/ckeditor5-basic-styles";
  import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
  import { CodeBlock } from "@ckeditor/ckeditor5-code-block";
  import { Essentials } from "@ckeditor/ckeditor5-essentials";
  import { Heading } from "@ckeditor/ckeditor5-heading";
  import {
    Image,
    ImageCaption,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
  } from "@ckeditor/ckeditor5-image";
  import { Indent } from "@ckeditor/ckeditor5-indent";
  import { Link } from "@ckeditor/ckeditor5-link";
  import { List } from "@ckeditor/ckeditor5-list";
  import { MediaEmbed } from "@ckeditor/ckeditor5-media-embed";
  import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
  import { Table, TableToolbar } from "@ckeditor/ckeditor5-table";
  import { Base64UploadAdapter } from "@ckeditor/ckeditor5-upload";
  import { Alignment } from "@ckeditor/ckeditor5-alignment";
  import { Mathlive, MathlivePanelview } from "@yayure/ckeditor5-mathlive";
  import CKEditorInspector from "@ckeditor/ckeditor5-inspector";

  const editorRef = ref(null); // Tham chiếu DOM cho editor
  const { initialize }: any = useNuxtApp().$ckeditor;
  onMounted(async () => {
    initialize('#editor');
      
  });
  </script>
  