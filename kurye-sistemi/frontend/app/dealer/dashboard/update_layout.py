import re

# Read the file
with open('/root/.openclaw/workspace/kurye-sistemi/frontend/app/dealer/dashboard/page.tsx', 'r') as f:
    content = f.read()

# New layout code
new_layout = '''              {/* Map and Right Panel Side by Side */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, marginBottom: 24 }}>
                {/* Map - Takes full height */}
                <div style={{
                  background: colors.white,
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  height: 600,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <LiveMap 
                    couriers={couriers} 
                    orders={orders.filter(o => o.status === 'onway' || o.status === 'assigned')}
                    restaurants={restaurants}
                    selectedCourier={selectedCourier}
                  />
                </div>

                {/* Right Panel - Couriers + Charts */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Couriers Panel */}
                  <div style={{
                    background: colors.sidebarBg,
                    borderRadius: 16,
                    padding: 20,
                    color: colors.white,
                    flex: 1,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Kuryeler</h3>
                      <div style={{ display: 'flex', gap: 8, fontSize: 11 }}>
                        <span style={{ color: '#10B981' }}>● Açık</span>
                        <span style={{ color: '#EF4444' }}>● Kapalı</span>
                      </div>
                    </div>

                    {/* Courier Tabs */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16, borderBottom: `1px solid ${colors.gray700}`, paddingBottom: 12 }}>
                      <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 8 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#10B981' }}>{courierCounts.available}</div>
                        <div style={{ fontSize: 11, color: colors.gray400 }}>Boşta</div>
                      </div>
                      <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 8 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: colors.yellow }}>{courierCounts.busy}</div>
                        <div style={{ fontSize: 11, color: colors.gray400 }}>Meşgul</div>
                      </div>
                      <div style={{ flex: 1, textAlign: 'center', padding: '8px', background: 'rgba(107, 114, 128, 0.1)', borderRadius: 8 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: colors.gray400 }}>{courierCounts.offline}</div>
                        <div style={{ fontSize: 11, color: colors.gray400 }}>Çevrimdışı</div>
                      </div>
                    </div>

                    {/* Courier List */}
                    <div style={{ maxHeight: 180, overflowY: 'auto' }}>
                      {couriers.slice(0, 5).map((courier) => (
                        <div
                          key={courier.id}
                          onClick={() => setSelectedCourier(selectedCourier === courier.id ? null : courier.id)}
                          style={{
                            padding: '10px 12px',
                            borderRadius: 8,
                            background: selectedCourier === courier.id ? colors.gray700 : 'transparent',
                            cursor: 'pointer',
                            marginBottom: 6,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                          }}
                        >
                          <div style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: courier.status === 'available' ? '#10B981' : courier.status === 'busy' ? colors.yellow : colors.gray500,
                          }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>{courier.name}</div>
                            <div style={{ fontSize: 11, color: colors.gray400 }}>
                              {courier.status === 'available' ? 'Boşta' : courier.status === 'busy' ? 'Meşgul' : 'Çevrimdışı'} • {courier.todayDeliveries} paket
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setShowAddCourierModal(true)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: 12,
                        background: colors.primary,
                        color: colors.white,
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Icons.plus /> Kurye Ekle
                    </button>
                  </div>

                  {/* Charts Panel */}
                  <div style={{
                    background: colors.sidebarBg,
                    borderRadius: 16,
                    padding: 20,
                    color: colors.white,
                    height: 220,
                  }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600 }}>Sipariş Kanalı (TL/Gün)</h3>
                    <div style={{ height: 150, display: 'flex', alignItems: 'flex-end', gap: 8, padding: '0 8px' }}>
                      {[65, 45, 80, 55, 70, 40, 90, 60, 75, 50, 85, 45].map((h, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{
                            width: '100%',
                            height: `${h * 1.5}px`,
                            background: i % 2 === 0 ? '#10B981' : '#3B82F6',
                            borderRadius: '4px 4px 0 0',
                            minHeight: 4,
                          }} />
                          <span style={{ fontSize: 9, color: colors.gray400 }}>{i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div style={{
                background: colors.white,
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Siparişler</h3>
                  <button 
                    onClick={() => setActiveMenu('orders')}
                    style={{
                      padding: '8px 16px',
                      background: colors.primary,
                      color: colors.white,
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Tümünü Gör
                  </button>
                </div>
                <OrdersTable 
                  orders={filteredOrders.slice(0, 5)} 
                  onAction={(order: Order) => { setSelectedOrder(order); setShowOrderActionModal(true); }}
                />
              </div>'''

# Find and replace
old_start = "{/* Map and Couriers Side by Side */}"
old_end_marker = "{/* Orders Table */}"

start_idx = content.find(old_start)
end_idx = content.find(old_end_marker)

if start_idx != -1 and end_idx != -1:
    # Find the pattern that ends the grid section
    pattern = "</div>\n\n              {/* Orders Table */}"
    actual_end = content.find(pattern, start_idx)
    if actual_end != -1:
        actual_end += len("</div>\n\n              ")
    else:
        actual_end = end_idx
    
    new_content = content[:start_idx] + new_layout + content[actual_end:]
    
    with open('/root/.openclaw/workspace/kurye-sistemi/frontend/app/dealer/dashboard/page.tsx', 'w') as f:
        f.write(new_content)
    print("Success")
else:
    print(f"Not found: {start_idx}, {end_idx}")
