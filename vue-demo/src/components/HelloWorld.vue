  <template>

    <el-row type="flex">
      <el-col :span="16" class="video-cl">
        <div class="grid-content bg-purple">
          <el-row :gutter="20">
            <video muted autoload="true" autoPlay="autoPlay" id="video-processed" class="video-js" controls crossorigin="anonymous">
              <source v-bind:src="baseUrl + videoName" type="video/mp4" >
            </video>
          </el-row>
          <el-row :gutter="20">
            <video muted autoload="true" autoPlay="autoPlay" id="video-origin" class="video-js" controls crossorigin="anonymous">
              <source v-bind:src="baseUrl + videoName" type="video/mp4" >
            </video>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8">
        <el-row>
          <el-col :span="5" type="flex"> <el-button @click="pauseAll"> Pause </el-button> </el-col>
          <el-col :span="15"> <el-button @click="playAll"> Play </el-button></el-col>
        </el-row>
        <el-row class="select-label">
          <el-col :span="5" type="flex" justify="start">
            Choose Network
          </el-col>
          <el-col :span="15" type="flex" justify="start">
            <el-select v-model="value" placeholder="Select a model" @change="changeOption">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="label" type="flex" justify="start">
          <el-divider content-position="left">Choose Video</el-divider>
        </el-row>
        <el-row>
          <el-table :data="tableData" :show-header=false @row-click="getDetails">
            <el-table-column
              v-for="{ prop, label } in colConfigs"
              :key="prop"
              :prop="prop"
              :label="label">
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
  </template>

<script>
/* eslint-disable */
  export default {
    name: "TestTwo",
    data () {
      this.colConfigs = [
        { prop: 'video', label: 'value' }
      ]
      this.player_origin = {}
      this.player_processed = {}
      this.upscaler = {}
      return {
        baseUrl: "https://cdn.vectorly.io/public-demos/",
        videoName: "jellyfish-240p.mp4",
        tableData: [],
        options: [{
          value: 'option1',
          label: 'residual_3k_3x',
          tag: 'general',
          version: '2.1'
        }, {
          value: 'option2',
          label: 'residual_4k_2x',
          tag: 'general',
          version: '0'
        }, {
          value: 'option3',
          label: 'residual_5k_2x',
          tag: 'general',
          version: '0'
        }, {
          value:  'option4',
          label: 'residual_5k_2x',
          tag: 'screenshare',
          version: '0'
        }, {
          value: 'option5',
          label: 'residual_5k_3x',
          tag: 'general',
          version: '0'
        }],
        value: ''
      }
    },
    mounted() { 
        this.getVideos()
        this.initVideo()
    },
    methods: {
        initVideo() {
          this.player_processed = videojs('video-processed', {width:1280, height:720});
          console.log(this.player_processed)
          videojs.registerPlugin('vectorlyPlugin', vectorlyUpscaler.videoJSPlugin);
          const upscaler = this.player_processed.vectorlyPlugin({
            token: (new URLSearchParams(window.location.search)).get("token"),
            networkParams: {
              name: 'residual_3k_3x', tag: 'general', version: '2.1'
            },
            fixaspectratio: false,
            debug: true
          })
          this.upscaler = upscaler;
          upscaler.addEventListener('load', function () {
            console.log("Upscaler initialized");
          });
          upscaler.addEventListener('error', function () {
            console.log("Failed to initialize");
          });
          upscaler.addEventListener('start', function () {
            console.log("Starting upscaling");
          });
          upscaler.addEventListener('stop', function () {
            console.log("Stopping upscaling");
          });

          this.player_origin = videojs('video-origin', {width:1280, height:720});
          var player_origin = this.player_origin;
          var player_processed = this.player_processed;
          this.player_processed.autoload = true;
          this.player_processed.preload = 'auto';
          setTimeout(function() {
            player_processed.play();
            player_origin.play()
          }, 10000);

          window.pause = function() {
            player_origin.pause()
            player_processed.pause()
          }

        },
        getVideos(){

          let videoNames = ['chimera-360p.mp4', 'chimera-240p.mp4', 'dota-240p.mp4', 'dota-360p.mp4', 'dota-360p-2.mp4' , 'ducks-240p.mp4', 'fish-240p.mp4', 'jellyfish-240p.mp4', 'khan-240p-2.mp4', 'khan-240p.mp4', 'sydney-240p.mp4', 'sydney-240p-2.mp4']

          this.tableData = videoNames.map(v => { return {video: v} } )
          console.log(this.tableData)


          //this.axios.get('api/getVideoList').then((response)=>{
          //  console.log(response.data.videos)
          //  this.tableData=response.data.videos;
          //  console.log(this.tableData)
          //}).catch((response)=>{
          //  console.log(response);
          //})
        },
        changeVideo(video) {
          var url = this.baseUrl + video;
          this.player_processed.src(url);
          this.player_processed.load(url);
          this.player_processed.play();
  
          this.player_origin.src(url);
          this.player_origin.load(url);
          this.player_origin.play()
          console.log(url)

        },
        changeOption(){
          console.log(this.value)
          let obj = {}
          obj = this.options.find(
              item=>{
                  if (item.value === this.value) {
                    console.log(item)
                    this.upscaler.changeNetwork({name: item.label, tag: item.tag, version: item.version })
                  }
              }
          )
        },
        getDetails(row) {
          console.log(row.video)
          this.videoName = row.video;
          this.changeVideo(row.video);
        },
        pauseAll() {
          console.log('Pausing')
          this.player_origin.pause()
          this.player_processed.pause()
        },
        playAll() {
          console.log('Playing')
          this.player_origin.play()
          this.player_processed.play()
        }
    }
  };
</script>

<style scoped>
  .test_two_box{
    display:flex;
    justify-content:center;
    flex-direction: column;
    align-items:center;
  }
  #video-origin{
    display:flex;
    /*justify-content:center;*/
    align-items: center;
    width: 960px;
    height: 540px;
  }
  #button {
    margin-right: 200px;
  }
  #video-processed{
    display:flex;
    /*justify-content:center;*/
    align-items: center;
    width: 960px;
    height: 540px;
  }
  .select-label {
    display:flex;
    justify-content:start;/*主轴上居中*/
    align-items:center;/*侧轴上居中*/
  }
  .video-cl {
    margin-left: 100px;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .el-divider {
     margin-top: 28px 0;
     margin-bottom: 5px 0;
     background: 0 0;
     border-top: 3px solid #E6EBF5;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
