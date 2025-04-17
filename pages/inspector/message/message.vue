<template>
	<view class="page">
		<!-- 顶部背景 -->
		<view class="top">
			<view class="background"></view>
		</view>
		
		<!-- 消息列表卡片 -->
		<view class="message-card">
			<view class="card">
				<view class="message-list">
					<!-- 按日期分组显示消息 -->
					<view class="message-group" v-for="(group, groupIndex) in groupedMessages" :key="groupIndex">
						<!-- 日期标题 -->
						<view class="date-header">
							<view class="date-line"></view>
							<view class="date-text">{{group.dateLabel}}</view>
							<view class="date-line"></view>
						</view>
						
						<!-- 今天的消息按小时分组 -->
						<block v-if="group.isToday">
							<!-- 小时分组 -->
							<view class="hour-group" v-for="(hourGroup, hourIndex) in group.subGroups" :key="hourIndex">
								<!-- 小时标题 -->
								<view class="hour-header">
									<view class="hour-text">{{hourGroup.timeLabel}}</view>
								</view>
								
								<!-- 该小时下的消息 -->
								<view class="message-item" v-for="(item, index) in hourGroup.messages" :key="index" @click="showMessageDetail(item)">
									<view class="message-content-box">
										<view class="left">
											<view class="message-icon">
												<svg v-if="item.type === '系统消息'" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="#5199ff" d="M20.255 5.52c-.331-1.087-1.464-1.504-2.394-1.194L7 7.946L5.632 7.49A2 2 0 0 0 3 9.388v4.225a2 2 0 0 0 2.632 1.897L7 15.054l.778.26l-.269.627a2 2 0 0 0 1.206 2.685l5.096 1.698a2 2 0 0 0 2.47-1.109l.4-.933l1.18.393c.93.31 2.063-.108 2.394-1.195c.325-1.064.745-3.015.745-5.98s-.42-4.916-.745-5.98m-5.477 12.127l-5.096-1.699l-.335.78l5.096 1.7z"/></g></svg>
												<svg v-else-if="item.type === '警告消息'" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#dc2626" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 13a1 1 0 1 0 0 2a1 1 0 0 0 0-2m0-9a1 1 0 0 0-.993.883L11 7v6a1 1 0 0 0 1.993.117L13 13V7a1 1 0 0 0-1-1"/></g></svg>
												<svg v-else xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-3.586l-3.707 3.707A1 1 0 0 1 6 17v-3H5a3 3 0 0 1-3-3V5zm20 4v6c0 1-.6 3-3 3h-1v3c0 .333-.2 1-1 1c-.203 0-.368-.043-.5-.113L12.613 18H9l3-3h3c1.333 0 4-.8 4-4V6c1 0 3 .6 3 3z" fill="#eab308"/></g></svg>
											</view>
										</view>
										<view class="center">
											<view class="message-title">{{item.title}}</view>
											<view class="message-content">{{item.content}}</view>
										</view>
										<view class="right">
											<view class="arrow-icon">
												<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#999" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.42z"/></svg>
											</view>
										</view>
									</view>
								</view>
							</view>
						</block>
						
						<!-- 非今天的消息 -->
						<block v-else>
							<view class="message-item" v-for="(item, index) in group.messages" :key="index" @click="showMessageDetail(item)">
								<view class="message-content-box">
									<view class="left">
										<view class="message-icon">
											<svg v-if="item.type === '系统消息'" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="#5199ff" d="M20.255 5.52c-.331-1.087-1.464-1.504-2.394-1.194L7 7.946L5.632 7.49A2 2 0 0 0 3 9.388v4.225a2 2 0 0 0 2.632 1.897L7 15.054l.778.26l-.269.627a2 2 0 0 0 1.206 2.685l5.096 1.698a2 2 0 0 0 2.47-1.109l.4-.933l1.18.393c.93.31 2.063-.108 2.394-1.195c.325-1.064.745-3.015.745-5.98s-.42-4.916-.745-5.98m-5.477 12.127l-5.096-1.699l-.335.78l5.096 1.7z"/></g></svg>
											<svg v-else-if="item.type === '警告消息'" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#dc2626" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 13a1 1 0 1 0 0 2a1 1 0 0 0 0-2m0-9a1 1 0 0 0-.993.883L11 7v6a1 1 0 0 0 1.993.117L13 13V7a1 1 0 0 0-1-1"/></g></svg>
											<svg v-else xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-3.586l-3.707 3.707A1 1 0 0 1 6 17v-3H5a3 3 0 0 1-3-3V5zm20 4v6c0 1-.6 3-3 3h-1v3c0 .333-.2 1-1 1c-.203 0-.368-.043-.5-.113L12.613 18H9l3-3h3c1.333 0 4-.8 4-4V6c1 0 3 .6 3 3z" fill="#eab308"/></g></svg>
										</view>
									</view>
									<view class="center">
										<view class="message-title">{{item.title}}</view>
										<view class="message-content">{{item.content}}</view>
									</view>
									<view class="right">
										<view class="arrow-icon">
											<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#999" d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.42z"/></svg>
										</view>
									</view>
								</view>
							</view>
						</block>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 消息详情弹窗 -->
		<uni-popup ref="popup" type="center">
			<view class="message-detail">
				<view class="detail-header">
					<view class="header-icon">
						<svg v-if="currentMessage.type === '系统消息'" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="#5199ff" d="M20.255 5.52c-.331-1.087-1.464-1.504-2.394-1.194L7 7.946L5.632 7.49A2 2 0 0 0 3 9.388v4.225a2 2 0 0 0 2.632 1.897L7 15.054l.778.26l-.269.627a2 2 0 0 0 1.206 2.685l5.096 1.698a2 2 0 0 0 2.47-1.109l.4-.933l1.18.393c.93.31 2.063-.108 2.394-1.195c.325-1.064.745-3.015.745-5.98s-.42-4.916-.745-5.98m-5.477 12.127l-5.096-1.699l-.335.78l5.096 1.7z"/></g></svg>
						<svg v-else-if="currentMessage.type === '警告消息'" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#dc2626" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 13a1 1 0 1 0 0 2a1 1 0 0 0 0-2m0-9a1 1 0 0 0-.993.883L11 7v6a1 1 0 0 0 1.993.117L13 13V7a1 1 0 0 0-1-1"/></g></svg>
						<svg v-else xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-3.586l-3.707 3.707A1 1 0 0 1 6 17v-3H5a3 3 0 0 1-3-3V5zm20 4v6c0 1-.6 3-3 3h-1v3c0 .333-.2 1-1 1c-.203 0-.368-.043-.5-.113L12.613 18H9l3-3h3c1.333 0 4-.8 4-4V6c1 0 3 .6 3 3z" fill="#eab308"/></g></svg>
					</view>
					<view class="header-info">
						<!-- <text class="detail-title">{{currentMessage.name}}</text> -->
						<view class="detail-meta">
							<text class="detail-time">{{currentMessage.time}}</text>
							<text class="detail-type" :class="currentMessage.name">{{currentMessage.name}}</text>
						</view>
					</view>
				</view>
				
				<view class="detail-content">
					<view class="content-text">{{currentMessage.content}}</view>
				</view>
				
				<view class="detail-footer">
					<button class="close-btn" @click="closeDetail">关闭</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messageList: [],
				groupedMessages: [],
				token: '',
				currentMessage: {
					title: '',
					content: '',
					time: '',
					type: ''
				}
			}
		},
		onShow() {
			this.getMessageList()
		},
		methods: {
			getMessageList() {
				const getToken = uni.getStorageSync("inspector_token")
				console.log("token：" + getToken)
				this.token = getToken
				
				if (!this.token) {
					uni.showToast({
						icon: "none",
						title: "请先登录"
					})
					return
				}
				
				uni.request({
					url: `${uni.$baseUrl}/message/getInspectorMessages`,
					method: 'GET',
					header: {
						'Authorization': this.token
					},
					success: (res) => {
						console.log("消息列表数据:", res.data.data)
						if (res.data.success) {
							// 按时间最新排序
							let messages = res.data.data
							if (messages && messages.length > 0) {
								messages.sort((a, b) => {
									return new Date(b.sendTime || b.time) - new Date(a.sendTime || a.time)
								})
								this.messageList = messages
								// 按日期分组消息
								this.groupMessagesByDate()
							}
						}
					},
					fail: () => {
						uni.showToast({
							icon: "error",
							title: "获取消息失败"
						})
					}
				})
			},
			// 按日期分组消息
			groupMessagesByDate() {
				const groups = [];
				let currentDate = '';
				let currentHour = -1;
				let currentGroup = null;
				let currentHourGroup = null;
				const now = new Date();
				const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				
				this.messageList.forEach(message => {
					const messageDate = this.getDateString(message.sendTime || message.time);
					const messageDateTime = new Date(message.sendTime || message.time);
					const isToday = this.isToday(messageDateTime);
					
					// 非今天的消息按日期分组
					if (!isToday) {
						// 如果日期变了，创建新的分组
						if (messageDate !== currentDate) {
							currentDate = messageDate;
							currentGroup = {
								date: messageDate,
								dateLabel: this.getDateLabel(message.sendTime || message.time),
								isToday: false,
								subGroups: [],
								messages: []
							};
							groups.push(currentGroup);
						}
						
						// 添加消息到当前日期分组
						currentGroup.messages.push(message);
					} 
					// 今天的消息按小时分组
					else {
						// 如果是新的一天，创建新的今天分组
						if (messageDate !== currentDate) {
							currentDate = messageDate;
							currentGroup = {
								date: messageDate,
								dateLabel: '今天',
								isToday: true,
								subGroups: [],
								messages: []
							};
							groups.push(currentGroup);
							currentHour = -1;
						}
						
						const messageHour = messageDateTime.getHours();
						
						// 如果小时变了或是同一小时但时间差超过一小时，创建新的小时分组
						if (messageHour !== currentHour) {
							currentHour = messageHour;
							currentHourGroup = {
								hour: messageHour,
								timeLabel: this.getHourLabel(messageDateTime),
								messages: []
							};
							currentGroup.subGroups.push(currentHourGroup);
						}
						
						// 添加消息到当前小时分组
						currentHourGroup.messages.push(message);
					}
				});
				
				this.groupedMessages = groups;
			},
			
			// 判断是否是今天
			isToday(date) {
				const now = new Date();
				const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				return date.getFullYear() === today.getFullYear() && 
					date.getMonth() === today.getMonth() && 
					date.getDate() === today.getDate();
			},
			
			// 获取小时标签
			getHourLabel(date) {
				const hours = date.getHours().toString().padStart(2, '0');
				const minutes = date.getMinutes().toString().padStart(2, '0');
				return `${hours}:${minutes}`;
			},
			
			// 获取日期字符串（用于比较）
			getDateString(dateString) {
				if (!dateString) return '';
				const date = new Date(dateString);
				return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
			},
			
			// 获取日期显示标签
			getDateLabel(dateString) {
				if (!dateString) return '';
				
				const date = new Date(dateString);
				const now = new Date();
				const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				
				// 今天只显示"今天"
				if (date.getFullYear() === today.getFullYear() && 
					date.getMonth() === today.getMonth() && 
					date.getDate() === today.getDate()) {
					return '今天';
				} else {
					// 其他日期显示完整日期
					const year = date.getFullYear();
					const month = (date.getMonth() + 1).toString().padStart(2, '0');
					const day = date.getDate().toString().padStart(2, '0');
					return `${year}-${month}-${day}`;
				}
			},
			
			// 获取每条消息的时间显示
			getMessageTime(dateString) {
				if (!dateString) return '';
				
				const date = new Date(dateString);
				const now = new Date();
				const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
				
				// 获取时间部分（小时:分钟）
				const hours = date.getHours().toString().padStart(2, '0');
				const minutes = date.getMinutes().toString().padStart(2, '0');
				const timeStr = `${hours}:${minutes}`;
				
				// 今天的消息只显示时间
				if (date.getFullYear() === today.getFullYear() && 
					date.getMonth() === today.getMonth() && 
					date.getDate() === today.getDate()) {
					return timeStr;
				} else {
					// 昨天和更早的消息显示完整日期和时间
					const year = date.getFullYear();
					const month = (date.getMonth() + 1).toString().padStart(2, '0');
					const day = date.getDate().toString().padStart(2, '0');
					return `${year}-${month}-${day} ${timeStr}`;
				}
			},
			
			showMessageDetail(message) {
				this.currentMessage = message
				this.$refs.popup.open()
			},
			closeDetail() {
				this.$refs.popup.close()
			},
			getMessageTypeText(type) {
				switch(type) {
					case 'system':
						return '系统消息';
					case 'violation':
						return '警告消息';
					default:
						return '普通消息';
				}
			},
			// 格式化时间显示
			formatTimeAgo(dateString) {
				if (!dateString) return '';
				
				const date = new Date(dateString);
				const now = new Date();
				const diffMs = now - date;
				const diffSec = Math.floor(diffMs / 1000);
				const diffMin = Math.floor(diffSec / 60);
				const diffHour = Math.floor(diffMin / 60);
				const diffDay = Math.floor(diffHour / 24);
				
				if (diffSec < 60) {
					return '刚刚';
				} else if (diffMin < 60) {
					return `${diffMin}分钟前`;
				} else if (diffHour < 24) {
					return `${diffHour}小时前`;
				} else if (diffDay < 7) {
					return `${diffDay}天前`;
				} else {
					// 日期格式化，超过7天显示具体日期
					const year = date.getFullYear();
					const month = (date.getMonth() + 1).toString().padStart(2, '0');
					const day = date.getDate().toString().padStart(2, '0');
					return `${year}-${month}-${day}`;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		height: 180rpx;
		position: relative;
		
		.background {
			background-color: #5199ff;
			border-bottom-left-radius: 22px;
			border-bottom-right-radius: 22px;
			position: absolute;
			height: 100rpx;
			width: 100%;
		}
	}
	
	.message-card {
		padding: 0 15px;
		
		.card {
			position: relative;
			bottom: 30px;
			background-color: transparent;
			padding: 0;
			
			.message-list {
				.message-group {
					margin-bottom: 30rpx;
					
					.date-header {
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 20rpx;
						margin-top: 20rpx;
						
						.date-line {
							flex: 1;
							height: 3rpx;
							background-color: #eee;
						}
						
						.date-text {
							font-size: 24rpx;
							color: #999;
							padding: 0 30rpx;
						}
					}
					
					.hour-group {
						margin-bottom: 20rpx;
						
						.hour-header {
							display: flex;
							align-items: center;
							justify-content: center;
							margin-bottom: 15rpx;
							padding-left: 10rpx;
							
							.hour-text {
								font-size: 24rpx;
								color: #999;
								background-color: #f8f8f8;
								padding: 5rpx 15rpx;
								border-radius: 30rpx;
							}
						}
					}
				
					.message-item {
						display: flex;
						flex-direction: column;
						padding: 20rpx;
						background-color: white;
						border-radius: 15px;
						box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
						margin-bottom: 20rpx;
						
						.message-time {
							font-size: 24rpx;
							color: #999;
							margin-bottom: 12rpx;
							padding-left: 10rpx;
						}
						
						.message-content-box {
							display: flex;
						}
						
						.left {
							width: 15%;
							display: flex;
							align-items: center;
							
							.message-icon {
								width: 80rpx;
								height: 80rpx;
								border-radius: 50%;
								display: flex;
								align-items: center;
								justify-content: center;
								background-color: #f8f8f8;
							}
						}
						
						.center {
							width: 75%;
							padding: 0 20rpx;
							
							.message-title {
								font-size: 32rpx;
								color: #333;
								margin-bottom: 10rpx;
								font-weight: bold;
							}
							
							.message-content {
								font-size: 26rpx;
								color: #666;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								overflow: hidden;
							}
						}
						
						.right {
							width: 10%;
							display: flex;
							align-items: center;
							justify-content: flex-end;
							
							.arrow-icon {
								width: 40rpx;
								height: 40rpx;
								display: flex;
								align-items: center;
								justify-content: center;
							}
						}
					}
				}
			}
		}
	}
	
	.message-detail {
		width: 650rpx;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
		
		.detail-header {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			padding-bottom: 20rpx;
			border-bottom: 1rpx solid #eee;
			
			.header-icon {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;
			}
			
			.header-info {
				flex: 1;
				
				.detail-title {
					font-size: 36rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 10rpx;
					display: block;
				}
				
				.detail-meta {
					display: flex;
					align-items: center;
					
					.detail-time {
						font-size: 24rpx;
						color: #999;
						margin-right: 20rpx;
					}
					
					.detail-type {
						font-size: 32rpx;
						padding: 4rpx 12rpx;
						border-radius: 20rpx;
						
						&.system {
							background-color: #e6f7ff;
							color: #1890ff;
						}
						
						&.violation {
							background-color: #fff1f0;
							color: #ff4d4f;
						}
						
						&.other {
							background-color: #f6ffed;
							color: #52c41a;
						}
					}
				}
			}
		}
		
		.detail-content {
			.content-text {
				font-size: 28rpx;
				color: #666;
				line-height: 1.6;
				margin-bottom: 30rpx;
			}
			
			.content-attachment {
				background-color: #f8f8f8;
				border-radius: 12rpx;
				padding: 20rpx;
				
				.attachment-title {
					font-size: 26rpx;
					color: #999;
					margin-bottom: 16rpx;
				}
				
				.attachment-list {
					.attachment-item {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding: 16rpx 0;
						border-bottom: 1rpx solid #eee;
						
						&:last-child {
							border-bottom: none;
						}
						
						.file-name {
							font-size: 26rpx;
							color: #333;
							flex: 1;
							margin-right: 20rpx;
						}
						
						.file-size {
							font-size: 24rpx;
							color: #999;
						}
					}
				}
			}
		}
		
		.detail-footer {
			display: flex;
			justify-content: flex-end;
			margin-top: 40rpx;
			
			.action-btn {
				width: 200rpx;
				height: 70rpx;
				line-height: 70rpx;
				background-color: #f0f0f0;
				color: #666;
				font-size: 28rpx;
				border-radius: 35rpx;
				text-align: center;
				margin-right: 20rpx;
				
				.btn-text {
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
			
			.close-btn {
				width: 200rpx;
				height: 70rpx;
				line-height: 70rpx;
				background-color: #5199ff;
				color: #fff;
				font-size: 28rpx;
				border-radius: 35rpx;
				text-align: center;
			}
		}
	}
	
	.message-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.header-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
	}
	
	.detail-type {
		font-size: 22rpx;
		padding: 4rpx 12rpx;
		border-radius: 20rpx;
		
		&.system {
			background-color: #e6f7ff;
			color: #1890ff;
		}
		
		&.violation {
			background-color: #fff1f0;
			color: #ff4d4f;
		}
		
		&.other {
			background-color: #f6ffed;
			color: #52c41a;
		}
	}
</style>
