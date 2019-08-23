<template>
  <div class="servers-tab">
    <search-header name="servers" />
    <div class="items-main-container">
      <div class="items-container">
        <div class="items">
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
          <div class="item">
            <div class="top">
              <div class="avatar"></div>
              <div class="name">Nertivia</div>
            </div>
            <div class="bottom">
              <div class="description">Nertivia is a cool server.</div>
              <div class="button">Join</div>
            </div>
          </div>
    
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import searchHeader from "./searchHeader";

export default {
  components: { searchHeader }
};
</script>

<style lang="scss" scoped>
.servers-tab {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.items-main-container {
  display: flex;
  flex-direction: column;
  overflow: auto;


}
.items-container {
  display: block;
  align-content: center;
  align-items: center;
  max-width: 1066px;
  margin: auto;
  width: 100%;
  .items {
    margin-top: 40px;
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, 250px);
    grid-auto-rows: min-content;
    align-items: stretch;
    justify-content: space-evenly;
    user-select: none;

    .item {
      width: 250px;
      height: 270px;
      background: rgba(0, 0, 0, 0.479);
      opacity: 0.9;
      margin: 5px;
      flex-shrink: 0;
      border-radius: 10px;
      transition: 0.3s;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      &:hover {
        opacity: 1;
      }
      .top {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 140px;
        justify-content: center;
        align-content: center;
        align-items: center;
        flex-shrink: 0;
        .avatar {
          background: rgb(26, 133, 255);
          height: 80px;
          width: 80px;
          border-radius: 50%;
          margin-bottom: 10px;
        }
        .name {
          font-size: 23px;
        }
      }
      .bottom {
        display: flex;
        flex-direction: column;
        background: rgba(0, 0, 0, 0.194);
        flex: 1;
        .description {
          margin: 20px;
          margin-top: 20px;
          margin-bottom: 10px;
          height: 100%;
          opacity: 0.9;
        }
        .button {
          background: rgba(40, 140, 255, 0.8);
          border-radius: 5px;
          align-self: flex-end;
          flex-shrink: 0;
          margin-bottom: 10px;
          margin-right: 10px;
          padding: 7px;
          transition: 0.3s;
          cursor: pointer;
          &:hover {
            background: rgb(40, 140, 255);
          }
        }
      }
    }

  }
}
</style>