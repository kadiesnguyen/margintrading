<!-- =========================================================================================
  Description: Data List - List View
  ----------------------------------------------------------------------------------------
  Item Name: Admin
  Author: Ares
  Author Telegram: @skydnz
========================================================================================== -->

<template>
  <div id="set-role-wrapper">

    <div id="loading-corners" class="vs-con-loading__container">
        <vs-table ref="table" search :data="data" v-if="!role">
            <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">

            <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                <!-- ADD NEW -->
            </div>

            <!-- ITEMS PER PAGE -->
            </div>

            <template slot="thead">
            <vs-th sort-key="email">ID</vs-th>
            <vs-th sort-key="role">Vai trò</vs-th>
            <vs-th sort-key="actions">Hành động</vs-th>
            </template>
            <template slot-scope="{data}">
                <tbody>
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <p>{{ tr.id }}</p>
                    </vs-td>
                    <vs-td>
                        <p>{{ tr.name }}</p>
                    </vs-td>
                    <vs-td class="whitespace-no-wrap text-center">
                        <vx-tooltip style="float: left" :title="tr.nick_name" color="warning" text="Chỉnh sửa quyền">
                            <vs-button color="dark" type="line" icon-pack="feather" icon="icon-edit" @click.stop="showRole(tr.role)"></vs-button>
                        </vx-tooltip>
                        
                    </vs-td>
                </vs-tr>
                </tbody>
            </template>
        </vs-table>
        <div v-else class="role-wapper">
            <!-- <label>Tên cấp bậc:</label> -->
            <h4 class="role-name">{{roleName}}</h4>

            <div class="role-list">
                <div class="flex items-center"> 
                    <feather-icon icon="LockIcon" />
                    <h4 class="ml-2">Sửa quyền hạn</h4>
                </div>
                
                <table class="roles-table">
                    <tr v-for="el, index in roleLines" :key="index">
                        <td v-for="role, index2 in el" :key="index2">
                             <vs-checkbox v-model="selectedRole[role.role]"> {{ role.label }}</vs-checkbox>
                        </td>
                        
                    </tr>
                </table>

                <vs-button class="mt-2" @click="saveRoles" v-if="checkRole('*')">Lưu thay đổi</vs-button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import DataViewSidebar from '@/layouts/account/slidebar/DataViewSidebar.vue'
import vSelect from 'vue-select'
import AuthenticationService from '@/services/AuthenticationService'
import { checkRole } from "@/helpers/helpers.js"

export default {
  components: {
    DataViewSidebar,
    vSelect
  },
  data() {
    return {
        checkRole,
        itemsPerLine: 4,
        itemsPerPage: 20,
        data: [
            {
                id: 1,
                role: 'admin',
                name: "Quản trị viên"

            },
             {
                id: 2,
                role: 'agency',
                name: "Nhân viên"
            }
        ],

        role: "",
        ROLES: [
            {
                role: "VIEW_DASHBOARD",
                label: "Xem Bảng điều khiển"
            },

            {
                role: "VIEW_USERS",
                label: "Xem người dùng"
            },

            {
                role: "EDIT_USERS",
                label: "Sửa thông tin người dùng"
            },

            {
                role: "VIEW_DEPOSIT",
                label: "Xem lịch sử nạp"
            },

            {
                role: "VIEW_WITHDRAW",
                label: "Xem lịch sử rút"
            },
            {
                role: "VIEW_BET_HISTORY",
                label: "Xem lịch sử cược"
            },
            {
                role: "VIEW_USER_INFO",
                label: "Xem thông tin người dùng"
            },
            {
                role: "VIEW_COMMISSION",
                label: "Xem hoa hồng"
            },

            {
                role: "VIEW_ROLE",
                label: "Xem vai trò"
            },

             {
                role: "VIEW_MAINTAIN",
                label: "Xem bảo trì"
            },

            {
                role: "VIEW_GAME",
                label: "Xem trò chơi"
            },

            {
                role: "VIEW_AGENT",
                label: "Xem đại lý"
            },

            {
                role: "VIEW_PAYMENT_METHOD",
                label: "Xem phương thức thanh toán"
            },
            {
                role: "VIEW_MANAGEMENT_INFO",
                label: "Xem thông tin quản lý"
            },
        ],

        selectedRole: {}
    }
   
  },
  created() {
   
  },

  computed:{
    roleName(){
        let role = this.data.find(e => e.role == this.role);
        return role.name
    },

    roleLines(){
        let totalLines = Math.floor(this.ROLES.length / this.itemsPerLine);
        if(totalLines < this.ROLES.length / this.itemsPerLine) totalLines += 1;
        let results = [];
        for(let i = 1; i <= totalLines; i++){
            let firstItem = (i - 1) * this.itemsPerLine;
            results.push(this.ROLES.slice(firstItem, firstItem + this.itemsPerLine))
        }

        return results;
    }


  },
  mounted() {
   
  },

  watch:{
    role(r){
        AuthenticationService.getRolesList(r).then((res) => {
            if(res.data.success == 1){
                const roles = res.data.data;
                const haveRoles = {}
                for (const role of roles){
                     haveRoles[role] = true; 
                }
                this.selectedRole = haveRoles;                
            }
        });
    }
  },
  
  methods:{
     showRole(role){
        this.role = role;
    },

    saveRoles(){
        const roles = Object.keys(this.selectedRole).filter((r)=>{
            return this.selectedRole[r] == true;
        })
        AuthenticationService.updateRoleList(this.role, roles).then((res) => {
            if(res.data.success == 1){
                return this.$vs.notify({
                    text: 'Cập nhật quyền thành công.',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'});
            }
        });
    },
    
  }
}
</script>

<style lang="scss">
#set-role-wrapper{
   
    .role-wapper{
        padding: 0 20px;
        .role-name{

        }

        .role-list{
            margin-top: 10px;
            border: 1px solid #eeeeee;
            padding: 20px;
        }
    }

    .roles-table{
        width: 100%;
        margin-top: 10px;
        tr {
            &:nth-child(odd) {
                background: #ececec;
            }
            td{
                padding: .72rem 2rem
            }
        }
    }
}
</style>
