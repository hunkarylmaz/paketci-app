class Shift {
  final String id;
  final DateTime startTime;
  final DateTime endTime;
  final String status;
  final DateTime? actualStartTime;
  final DateTime? actualEndTime;
  final int? lateArrivalMinutes;
  final int? earlyLeaveMinutes;
  final bool isCompliant;
  final double? complianceScore;

  Shift({
    required this.id,
    required this.startTime,
    required this.endTime,
    required this.status,
    this.actualStartTime,
    this.actualEndTime,
    this.lateArrivalMinutes,
    this.earlyLeaveMinutes,
    this.isCompliant = true,
    this.complianceScore,
  });

  factory Shift.fromJson(Map<String, dynamic> json) {
    return Shift(
      id: json['id'],
      startTime: DateTime.parse(json['startTime']),
      endTime: DateTime.parse(json['endTime']),
      status: json['status'],
      actualStartTime: json['actualStartTime'] != null 
          ? DateTime.parse(json['actualStartTime']) 
          : null,
      actualEndTime: json['actualEndTime'] != null 
          ? DateTime.parse(json['actualEndTime']) 
          : null,
      lateArrivalMinutes: json['lateArrivalMinutes'],
      earlyLeaveMinutes: json['earlyLeaveMinutes'],
      isCompliant: json['isCompliant'] ?? true,
      complianceScore: json['complianceScore']?.toDouble(),
    );
  }
}
